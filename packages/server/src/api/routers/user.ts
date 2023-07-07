import { S3 } from 'aws-sdk';
import { randomUUID } from 'crypto';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

const s3 = new S3({
  apiVersion: '2006-03-01',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET,
  region: process.env.AWS_REGION,
  signatureVersion: 'v4',
});

export const userRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany();
  }),
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: input.id,
        },
        include: {
          wishlist: true,
          team: {
            include: {
              project: true,
              members: true,
            },
          },
        },
      });

      return user;
    }),
  addToWishlist: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { projectId } = input;

      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        include: { wishlist: true },
      });

      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not found',
        });
      }

      const existingProject = user.wishlist.find(
        (project) => project.id === projectId,
      );

      if (existingProject) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Project already in wishlist',
        });
      }

      const project = await ctx.prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!project) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Project already in wishlist',
        });
      }

      const updatedUser = await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: { wishlist: { connect: { id: projectId } } },
        include: { wishlist: true },
      });

      return updatedUser.wishlist;
    }),
  deleteFromWishlist: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { projectId } = input;

      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        include: { wishlist: true },
      });

      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not found',
        });
      }

      const existingProject = user.wishlist.find(
        (project) => project.id === projectId,
      );

      if (!existingProject) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Project not in wishlist',
        });
      }

      const updatedUser = await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: { wishlist: { disconnect: { id: projectId } } },
        include: { wishlist: true },
      });

      return updatedUser.wishlist;
    }),
  pdfUpload: protectedProcedure
    .input(z.object({ extension: z.string() }))
    .mutation(({ input }) => {
      const ex = input.extension.split('/')[1]!;
      console.log(ex);
      const key = `${randomUUID()}.${ex}`;
      const params = {
        Bucket: process.env.AWS_BUCKET,
        Key: key,
        Expires: 60,
        ContentType: `application/${ex}`,
      };
      const uploadUrl = s3.getSignedUrl('putObject', params);

      return {
        uploadUrl,
        key,
      };
    }),
  userInfo: protectedProcedure
    .input(
      z.object({
        firstName: z.string(),
        middleName: z.string(),
        lastName: z.string(),
        college: z.string(),
        branch: z.string().optional(),
        year: z.number().min(1).max(4).optional(),
        contact: z.number().min(8),
        mentor: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const info = await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          firstName: input.firstName,
          middleName: input.middleName,
          lastName: input.lastName,
          college: input.college,
          branch: input.branch,
          year: input.year,
          contact: Number(input.contact),
          role: input.mentor ? 'MENTOR' : 'USER',
        },
      });
      return info;
    }),
});
