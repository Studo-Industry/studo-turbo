import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';
import { randomUUID } from 'crypto';
import S3 from 'aws-sdk/clients/s3';
import { TRPCError } from '@trpc/server';

const s3 = new S3({
  apiVersion: '2006-03-01',
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
  region: process.env.AWS_REGION,
  signatureVersion: 'v4',
});

export const projectRouter = createTRPCRouter({
  //   hello: publicProcedure
  //     .input(z.object({ text: z.string() }))
  //     .query(({ input }) => {
  //       return {
  //         greeting: `Hello ${input.text}`,
  //       };
  //     }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.project.findMany();
  }),
  getBatch: protectedProcedure
    .input(
      z.object({
        limit: z.number(),
        // cursor is a reference to the last item in the previous batch
        // it's used to fetch the next batch
        cursor: z.string().nullish(),
        skip: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, skip, cursor } = input;
      const items = await ctx.prisma.project.findMany({
        take: limit + 1,
        skip: skip,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          id: 'asc',
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop(); // return the last item from the array
        nextCursor = nextItem?.id;
      }
      return {
        items,
        nextCursor,
      };
    }),
  getBatchByCategory: protectedProcedure
    .input(
      z.object({
        category: z.string(),
        limit: z.number(),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, skip, cursor } = input;
      const items = await ctx.prisma.project.findMany({
        take: limit + 1,
        skip: skip,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          id: 'asc',
        },
        where: {
          categories: {
            has: input.category,
          },
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop(); // return the last item from the array
        nextCursor = nextItem?.id;
      }
      return {
        items,
        nextCursor,
      };
    }),
  getBatchBySearch: protectedProcedure
    .input(
      z.object({
        limit: z.number(),
        // cursor is a reference to the last item in the previous batch
        // it's used to fetch the next batch
        cursor: z.string().nullish(),
        skip: z.number().optional(),
        search: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, skip, cursor } = input;
      const items = await ctx.prisma.project.findMany({
        take: limit + 1,
        skip: skip,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          id: 'asc',
        },
        where: {
          OR: [
            {
              title: {
                contains: input.search,
                mode: 'insensitive',
              },
            },
            {
              categories: {
                has: input.search,
              },
            },
            {
              company: {
                contains: input.search,
                mode: 'insensitive',
              },
            },
          ],
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop(); // return the last item from the array
        nextCursor = nextItem?.id;
      }
      return {
        items,
        nextCursor,
      };
    }),
  getOne: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findUnique({
        where: {
          id: input.id,
        },
        include: {
          Team: {
            orderBy: {
              presentMilestone: 'desc',
            },
          },
        },
      });

      return project;
    }),
  getProjectByCategory: publicProcedure
    .input(z.object({ category: z.string() }))
    .query(({ ctx, input }) => {
      if (input.category === 'All Projects') {
        return ctx.prisma.project.findMany();
      } else {
        return ctx.prisma.project.findMany({
          where: {
            categories: {
              has: input.category,
            },
          },
        });
      }
    }),
  getProjectBySearch: protectedProcedure
    .input(z.object({ search: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.project.findMany({
        where: {
          OR: [
            {
              title: {
                contains: input.search,
                mode: 'insensitive',
              },
            },
            {
              categories: {
                has: input.search,
              },
            },
            {
              company: {
                contains: input.search,
                mode: 'insensitive',
              },
            },
          ],
        },
      });
    }),
  getSample: publicProcedure
    .input(z.object({ category: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.project.findMany({
        take: 3,
        where: {
          categories: {
            has: input.category,
          },
        },
      });
    }),
  imageUpload: protectedProcedure
    .input(z.object({ extension: z.string() }))
    .mutation(({ input }) => {
      const ex = input.extension.split('/')[1]!;
      console.log(ex);
      const key = `${randomUUID()}.${ex}`;
      const params = {
        Bucket: process.env.AWS_BUCKET,
        Key: key,
        Expires: 60,
        ContentType: `image/${ex}`,
      };
      const uploadUrl = s3.getSignedUrl('putObject', params);

      return {
        uploadUrl,
        key,
      };
    }),

  //admin procedures
  createProject: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        features: z.string(),
        company: z.string(),
        tags: z.string().array(),
        categories: z.string().array(),
        images: z.string().array(),
        components: z.string(),
        implementation: z.string(),
        skills: z.string(),
        relatedInfo: z.string(),
        specifications: z.string(),
        videoLink: z.string(),
        paidProject: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== 'ADMIN')
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Only admins can create a new project',
        });
      const result = await ctx.prisma.project.create({
        data: {
          title: input.title,
          description: input.description,
          company: input.company,
          features: input.features,
          tags: input.tags,
          categories: input.categories,
          images: input.images,
          components: input.components,
          implementation: input.implementation,
          skills: input.skills,
          paidProject: input.paidProject,
          relatedInfo: input.relatedInfo,
          specifications: input.specifications,
          videoLink: input.videoLink,
        },
      });
      return result;
    }),
});
