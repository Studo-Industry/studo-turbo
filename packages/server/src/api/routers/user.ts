import { S3 } from 'aws-sdk';
import { randomUUID } from 'crypto';
import { z } from 'zod';
// import { env } from '~/env.mjs';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';

const s3 = new S3({
  apiVersion: '2006-03-01',
  accessKeyId: process.env.AWS_ACCESS_KEY,
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
        throw new Error('User not found');
      }

      const existingProject = user.wishlist.find(
        (project) => project.id === projectId,
      );

      if (existingProject) {
        throw new Error('Project already in wishlist');
      }

      const project = await ctx.prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!project) {
        throw new Error('Project not found');
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
        throw new Error('User not found');
      }

      const existingProject = user.wishlist.find(
        (project) => project.id === projectId,
      );

      if (!existingProject) {
        throw new Error('Project not found in wishlist');
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
});
