import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';

export const collegeRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const colleges = await ctx.prisma.college.findMany();
    return colleges;
  }),
  // search: protectedProcedure
  //   .input(z.object({ query: z.string() }))
  //   .query(async ({ ctx, input }) => {
  //     const colleges = await ctx.prisma.college.findMany({
  //       where: {
  //         OR: [
  //           {
  //             code: {
  //               contains: input.query,
  //               mode: "insensitive",
  //             },
  //             name: {
  //               contains: input.query,
  //               mode: "insensitive",
  //             },
  //           },
  //         ],
  //       },
  //     });
  //     return colleges;
  //   }),
});
