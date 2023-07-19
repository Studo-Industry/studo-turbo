import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import Razorpay from 'razorpay';
import { TRPCError } from '@trpc/server';
import { randomUUID, createHmac } from 'crypto';

export const paymentRouter = createTRPCRouter({
  pay: protectedProcedure
    .input(z.object({ projectId: z.string(), teamId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const options = {
        amount: '39900',
        currency: 'INR',
        receipt: randomUUID(),
        payment_capture: true,
      };
      try {
        const razorPayInstance = new Razorpay({
          key_id: String(process.env.RAZORPAY_KEY_ID),
          key_secret: String(process.env.RAZORPAY_KEY_SECRET),
        });
        const razorpayStuff = await razorPayInstance.orders.create(options);
        const order = await ctx.prisma.order.create({
          data: {
            id: razorpayStuff.id,
            teamId: input.teamId,
            status: false,
            payee: ctx.session.user.id,
          },
        });
        // console.log('ORDER', order);
        console.log(razorpayStuff);
        return razorpayStuff;
      } catch (error) {
        console.log(error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
    }),
  verify: protectedProcedure
    .input(
      z.object({
        teamId: z.string(),
        orderDetails: z.object({
          razorpay_order_id: z.string(),
          razorpay_payment_id: z.string(),
          razorpay_signature: z.string(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const shasum = createHmac(
        'sha256',
        String(process.env.RAZORPAY_KEY_SECRET),
      );
      shasum.update(
        input.orderDetails.razorpay_order_id +
          '|' +
          input.orderDetails.razorpay_payment_id,
      );
      const digest = shasum.digest('hex');

      console.log(
        'digst:',
        digest,
        '\n order signature',
        input.orderDetails.razorpay_signature,
      );

      if (digest === input.orderDetails.razorpay_signature) {
        console.log('request is legit');
        const order = await ctx.prisma.order.update({
          where: { id: input.orderDetails.razorpay_order_id },
          include: {
            team: true,
          },
          data: {
            status: true,
            team: {
              update: {
                payment_status: true,
              },
            },
          },
        });
        // console.log('ORDER DONE', order);
        return { status: 'success' };
      } else {
        // pass it
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Something went wrong, pLease contact support.',
        });
      }
    }),
});
