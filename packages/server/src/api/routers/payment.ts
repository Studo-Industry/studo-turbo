import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import PaytmChecksum from '../../utils/PaytmChecksum';

// export const paymentRouter = createTRPCRouter({

//   pay: protectedProcedure
//     .input(z.object({ projectId: z.string(), teamId: z.string() }))
//     .mutation(async ({ ctx, input }) => {
//       const options = {
//         amount: '39900',
//         currency: 'INR',
//         receipt: randomUUID(),
//         payment_capture: true,
//       };
//       try {
//         const razorPayInstance = new Razorpay({
//           key_id: String(process.env.RAZORPAY_KEY_ID),
//           key_secret: String(process.env.RAZORPAY_KEY_SECRET),
//         });
//         const razorpayStuff = await razorPayInstance.orders.create(options);
//         const order = await ctx.prisma.order.create({
//           data: {
//             id: razorpayStuff.id,
//             teamId: input.teamId,
//             status: false,
//             payee: ctx.session.user.id,
//           },
//         });
//         // console.log('ORDER', order);
//         console.log(razorpayStuff);
//         return razorpayStuff;
//       } catch (error) {
//         console.log(error);
//         throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
//       }
//     }),
//   verify: protectedProcedure
//     .input(
//       z.object({
//         teamId: z.string(),
//         orderDetails: z.object({
//           razorpay_order_id: z.string(),
//           razorpay_payment_id: z.string(),
//           razorpay_signature: z.string(),
//         }),
//       }),
//     )
//     .mutation(async ({ ctx, input }) => {
//       const shasum = createHmac(
//         'sha256',
//         String(process.env.RAZORPAY_KEY_SECRET),
//       );
//       shasum.update(
//         input.orderDetails.razorpay_order_id +
//           '|' +
//           input.orderDetails.razorpay_payment_id,
//       );
//       const digest = shasum.digest('hex');

//       console.log(
//         'digst:',
//         digest,
//         '\n order signature',
//         input.orderDetails.razorpay_signature,
//       );

//       if (digest === input.orderDetails.razorpay_signature) {
//         console.log('request is legit');
//         const order = await ctx.prisma.order.update({
//           where: { id: input.orderDetails.razorpay_order_id },
//           include: {
//             team: true,
//           },
//           data: {
//             status: true,
//             team: {
//               update: {
//                 payment_status: true,
//               },
//             },
//           },
//         });
//         // console.log('ORDER DONE', order);
//         return { status: 'success' };
//       } else {
//         // pass it
//         throw new TRPCError({
//           code: 'BAD_REQUEST',
//           message: 'Something went wrong, pLease contact support.',
//         });
//       }
//     }),
// });

export const paymentRouter = createTRPCRouter({
  // pay: protectedProcedure
  //   .input(z.object({ projectId: z.string(), teamId: z.string() }))
  //   .mutation(async ({ ctx, input }) => {
  //     // const options = {
  //     //   amount: '39900',
  //     //   currency: 'INR',
  //     //   receipt: randomUUID(),
  //     //   payment_capture: true,
  //     // };
  //     // try {
  //     //   const razorPayInstance = new Razorpay({
  //     //     key_id: String(process.env.RAZORPAY_KEY_ID),
  //     //     key_secret: String(process.env.RAZORPAY_KEY_SECRET),
  //     //   });
  //     //   const razorpayStuff = await razorPayInstance.orders.create(options);
  //     //   const order = await ctx.prisma.order.create({
  //     //     data: {
  //     //       id: razorpayStuff.id,
  //     //       teamId: input.teamId,
  //     //       status: false,
  //     //       payee: ctx.session.user.id,
  //     //     },
  //     //   });
  //     //   // console.log('ORDER', order);
  //     //   console.log(razorpayStuff);
  //     //   return razorpayStuff;
  //     // } catch (error) {
  //     //   console.log(error);
  //     //   throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
  //     // }
  //   }),
  pay: protectedProcedure
    .input(
      z.object({
        teamId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const order = await ctx.prisma.order.create({
          data: {
            payee: ctx.session.user.id,
            teamId: input.teamId,
            status: false,
          },
        });
        let paytmParams: {
          [key: string]: any;
        } = {
          body: {
            requestType: 'Payment',
            mid: String(process.env.PAYTM_MERCHANT_ID),
            websiteName: 'DEFAULT',
            orderId: order.id,
            callbackUrl: `https://www.studoindustry.com/dashboard/team/thankyou?teamId=${input.teamId}&orderId=${order.id}`,
            txnAmount: {
              value: '399.00',
              currency: 'INR',
            },
            userInfo: {
              custId: ctx.session.user.id,
            },
          },
        };

        const checksum = await PaytmChecksum.generateSignature(
          JSON.stringify(paytmParams.body),
          process.env.PAYTM_MERCHANT_KEY,
        );
        console.log(checksum);
        paytmParams.head = {
          signature: checksum,
        };

        var post_data = await JSON.stringify(paytmParams);

        let response = await fetch(
          `https://securegw.paytm.in/theia/api/v1/initiateTransaction?mid=${process.env.PAYTM_MERCHANT_ID}&orderId=${order.id}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': `${post_data.length}`,
            },
            body: post_data,
          },
        );
        let res = await response.json();
        console.log(res);
        if (!res || !order) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Something went wrong, pLease try again.',
          });
        }
        return {
          paytm: res,
          order: order,
        };
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong, pLease try again.',
        });
      }
    }),
  verify: protectedProcedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const order = await ctx.prisma.order.findUnique({
          where: {
            id: input.orderId,
          },
        });
        if (!order) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Something went wrong , contact admin.',
          });
        }
        let paytmParams: {
          [key: string]: any;
        } = {
          body: {
            mid: String(process.env.PAYTM_MERCHANT_ID),
            orderId: order.id,
          },
        };

        const checksum = await PaytmChecksum.generateSignature(
          JSON.stringify(paytmParams.body),
          process.env.PAYTM_MERCHANT_KEY,
        );
        console.log(checksum);
        paytmParams.head = {
          signature: checksum,
        };

        var post_data = await JSON.stringify(paytmParams);

        let response = await fetch(
          `https://securegw.paytm.in/v3/order/status/`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': `${post_data.length}`,
            },
            body: post_data,
          },
        );
        let res = await response.json();
        console.log(res);
        if (!res || !order) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Something went wrong, pLease try again.',
          });
        }
        if (res.body.resultInfo.resultStatus === 'TXN_FAILURE') {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Payment Failed',
          });
        }
        if (res.body.resultInfo.resultStatus === 'NO_RECORD_FOUND') {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Payment Failed',
          });
        }
        if (res.body.resultInfo.resultStatus === 'PENDING') {
          return {
            status: 'PENDING',
            message:
              'Please wait for a while and refresh the page the payment is being processed.',
          };
        }
        await ctx.prisma.order.update({
          where: { id: order.id },
          data: { status: true },
        });
        await ctx.prisma.team.update({
          where: { id: order.teamId },
          data: {
            payment_status: true,
          },
        });
        return {
          status: 'SUCCESS',
          message: 'Done',
        };
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong, pLease try again.',
        });
      }
    }),
});
