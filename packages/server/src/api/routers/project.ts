import { TRPCClientError } from '@trpc/client';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';
import { randomUUID } from 'crypto';
import S3 from 'aws-sdk/clients/s3';

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
  getOne: protectedProcedure
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
  getProjectByCategory: protectedProcedure
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

  //   getSecretMessage: protectedProcedure.query(() => {
  //     return "you can now see this secret message!";
  //   }),
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
});
