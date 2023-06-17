import { TRPCClientError } from '@trpc/client';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';

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
});
