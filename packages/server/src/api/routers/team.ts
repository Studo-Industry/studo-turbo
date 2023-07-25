import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { randomUUID } from 'crypto';
import S3 from 'aws-sdk/clients/s3';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});
const s3 = new S3({
  apiVersion: '2006-03-01',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET,
  region: process.env.AWS_REGION,
  signatureVersion: 'v4',
});

function generateRandomCharacter() {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let counter = 0;
  while (counter < 1) {
    result += characters.charAt(Math.floor(Math.random() * 1));
    counter += 1;
  }
  return result;
}

export const teamRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        college: z.string().min(2),
        year: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role === 'MENTOR') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Mentor is not allowed to create team.',
        });
      }
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        include: {
          team: true,
        },
      });
      if (user?.team[0] === null) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'User can only have 1 team',
        });
      }
      const time = new Date();
      const refferal =
        'studo' +
        String(time.getFullYear()) +
        String(time.getHours()) +
        String(time.getMilliseconds()) +
        String(generateRandomCharacter());
      const team = await ctx.prisma.team.create({
        data: {
          projectId: input.projectId,
          college: input.college,
          year: input.year,
          referral_code: refferal,
          leader: ctx.session.user.id,
          payment_status: false,
          presentMilestone: 1,
          approvedMilestone: 0,
          milestone1LinkCheck: false,
          milestone2LinkCheck: false,
          milestone3LinkCheck: false,
          milestone4LinkCheck: false,
          milestone5LinkCheck: false,
          milestone6LinkCheck: false,
        },
      });
      await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          team: {
            connect: {
              id: team.id,
            },
          },
        },
      });
      return team;
    }),
  join: protectedProcedure
    .input(z.object({ referral: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const team = await ctx.prisma.team.findUnique({
        where: {
          referral_code: input.referral,
        },
        include: {
          members: true,
          project: true,
        },
      });
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        include: {
          team: true,
        },
      });
      if (!team) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Team not found',
        });
      }
      if (team.college !== user?.college) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You are trying to enter team from a different college.',
        });
      }
      if (team.members.length === 6) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Team is already full',
        });
      }
      if (ctx.session.user.role === 'MENTOR') {
        const team = ctx.prisma.team.update({
          where: {
            referral_code: input.referral,
          },
          include: {
            members: true,
          },
          data: {
            mentor: ctx.session.user.id,
            members: {
              connect: { id: ctx.session.user.id },
            },
          },
        });
        return team;
      }
      if (team.members.length === 5 && team.mentor === null) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Team can only have 5 members and 1 mentor',
        });
      }
      if (user.year !== team.year) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: `This team is for year ${team.year}.`,
        });
      }
      if (user.team.length !== 0) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You are already part of a team.',
        });
      }
      const updatedUser = ctx.prisma.team.update({
        where: {
          referral_code: input.referral,
        },
        include: {
          members: true,
        },
        data: {
          members: {
            connect: { id: ctx.session.user.id },
          },
        },
      });
      return updatedUser;
    }),

  getTeam: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const team = await ctx.prisma.team.findFirst({
          where: {
            id: input.id,
          },
          include: {
            members: true,
            project: true,
          },
        });
        const check = team?.members.find(
          (member) => member.id === ctx.session.user.id,
        );
        if (check) {
          return team;
        } else {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Team not found',
          });
        }
      } catch (error) {
        console.log(error);
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Team not found' });
      }
    }),
  getTeamByReferral: protectedProcedure
    .input(z.object({ referral: z.string() }))
    .query(({ ctx, input }) => {
      const team = ctx.prisma.team.findUnique({
        where: { referral_code: input.referral },
        select: {
          project: true,
          college: true,
          referral_code: true,
          year: true,
          members: true,
        },
      });
      if (team) {
        return team;
      }
      throw new TRPCError({ code: 'NOT_FOUND' });
    }),
  leaveTeam: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const team = await ctx.prisma.team.findUnique({
          where: {
            id: input.teamId,
          },
        });
        if (!team)
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Team doesnt exist.',
          });

        if (ctx.session.user.role === 'MENTOR') {
          const team = await ctx.prisma.team.update({
            where: {
              id: input.teamId,
            },
            include: {
              members: true,
            },
            data: {
              mentor: null,
              members: {
                disconnect: {
                  id: ctx.session.user.id,
                },
              },
            },
          });
          return team;
        }
        const updatedTeam = await ctx.prisma.team.update({
          where: {
            id: input.teamId,
          },
          include: {
            members: true,
          },
          data: {
            members: {
              disconnect: {
                id: ctx.session.user.id,
              },
            },
          },
        });
        return updatedTeam;
      } catch (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Unable to leave team!',
        });
      }
    }),
  deleteTeam: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const team = await ctx.prisma.team.delete({
          where: {
            id: input.teamId,
          },
        });
        return team;
      } catch (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Something went wrong.',
        });
      }
    }),
  //TODO: Fix left
  getMilestone: protectedProcedure.query(async ({ ctx }) => {
    try {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        include: {
          team: true,
        },
      });
      if (user && user.team[0]?.presentMilestone) {
        return user.team[0]?.presentMilestone;
      }
      return 0;
    } catch (error) {
      console.log(error);
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Something went wrong.',
      });
    }
  }),
  mileStoneSubmit: protectedProcedure
    .input(
      z.object({
        milestone: z.number().max(6).min(1),
        files: z.string().array(),
        typeofmilestone: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (ctx.session.user.role === 'MENTOR')
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Mentor cannot submit milestones.',
          });
        const user = await ctx.prisma.user.findUnique({
          where: { id: ctx.session.user.id },
          include: {
            team: true,
          },
        });
        let team;
        if (user) {
          switch (input.milestone) {
            case 1:
              team = await ctx.prisma.team.update({
                where: {
                  id: user.team[0].id,
                },
                data: {
                  milestone1: {
                    push: input.files,
                  },
                  milestone1LinkCheck: input.typeofmilestone,
                  presentMilestone: 2,
                },
              });
              break;
            case 2:
              team = await ctx.prisma.team.update({
                where: {
                  id: user.team[0].id,
                },
                data: {
                  milestone2: {
                    push: input.files,
                  },
                  milestone2LinkCheck: input.typeofmilestone,
                  presentMilestone: 3,
                },
              });
              break;
            case 3:
              team = await ctx.prisma.team.update({
                where: {
                  id: user.team[0].id,
                },
                data: {
                  milestone3: {
                    push: input.files,
                  },
                  milestone3LinkCheck: input.typeofmilestone,
                  presentMilestone: 4,
                },
              });
              break;
            case 4:
              team = await ctx.prisma.team.update({
                where: {
                  id: user.team[0].id,
                },
                data: {
                  milestone4: {
                    push: input.files,
                  },
                  milestone4LinkCheck: input.typeofmilestone,
                  presentMilestone: 5,
                },
              });
              break;
            case 5:
              team = await ctx.prisma.team.update({
                where: {
                  id: user.team[0].id,
                },
                data: {
                  milestone5: {
                    push: input.files,
                  },
                  milestone5LinkCheck: input.typeofmilestone,
                  presentMilestone: 6,
                },
              });
              break;
            case 6:
              team = await ctx.prisma.team.update({
                where: {
                  id: user.team[0].id,
                },
                data: {
                  milestone6: {
                    push: input.files,
                  },
                  milestone6LinkCheck: input.typeofmilestone,
                  presentMilestone: 7,
                },
              });
              break;
            default:
              throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'Something went wrong.',
              });
          }
          return team;
        }
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Something went wrong.',
        });
      }
    }),
  removeFromTeam: protectedProcedure
    .input(z.object({ userId: z.string(), teamId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await ctx.prisma.user.update({
          where: {
            id: input.userId,
          },
          data: {
            team: {
              disconnect: {
                id: input.teamId,
              },
            },
          },
        });
        return user;
      } catch (error) {
        throw new Error('Something went wrong!');
      }
    }),

  //mentor procedures
  milestoneRejection: protectedProcedure
    .input(
      z.object({
        teamId: z.string(),
        milestone: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let team;
      try {
        switch (input.milestone) {
          case 1:
            team = await ctx.prisma.team.update({
              where: {
                id: input.teamId,
              },
              data: {
                milestone1: {
                  set: [],
                },
                presentMilestone: 1,
              },
            });
            break;
          case 2:
            team = await ctx.prisma.team.update({
              where: {
                id: input.teamId,
              },
              data: {
                milestone2: {
                  set: [],
                },
                presentMilestone: 2,
              },
            });
            break;
          case 3:
            team = await ctx.prisma.team.update({
              where: {
                id: input.teamId,
              },
              data: {
                milestone3: {
                  set: [],
                },
                presentMilestone: 3,
              },
            });
            break;
          case 4:
            team = await ctx.prisma.team.update({
              where: {
                id: input.teamId,
              },
              data: {
                milestone4: {
                  set: [],
                },
                presentMilestone: 4,
              },
            });
            break;
          case 5:
            team = await ctx.prisma.team.update({
              where: {
                id: input.teamId,
              },
              data: {
                milestone5: {
                  set: [],
                },
                presentMilestone: 5,
              },
            });
            break;
          case 6:
            team = await ctx.prisma.team.update({
              where: {
                id: input.teamId,
              },
              data: {
                milestone6: {
                  set: [],
                },
                presentMilestone: 6,
              },
            });
            break;
          default:
            return new Error('Some error occured, try again');
        }
        return team;
      } catch (error) {
        console.log(error);
        return new Error('Something went wrong!');
      }
    }),
  milestoneApproval: protectedProcedure
    .input(
      z.object({
        teamId: z.string(),
        presentMilestone: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const team = ctx.prisma.team.update({
          where: {
            id: input.teamId,
          },
          data: {
            approvedMilestone: input.presentMilestone,
          },
        });
        return team;
      } catch (error) {
        console.log(error);
        return new Error('Something went wrong,try again');
      }
    }),

  //admin procedures
  getRecentTeams: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.team.findMany({
      take: 5,
      orderBy: {
        appliedAt: 'desc',
      },
      include: {
        project: true,
        members: true,
      },
    });
  }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.session.user.role !== 'ADMIN') {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'This is restricted only for admins',
      });
    }
    return ctx.prisma.team.findMany();
  }),
  getApprovalRequestingTeams: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.team.findMany({
      where: {
        orderStatus: true,
        payment_status: false,
      },
    });
  }),
  approveTeamPayment: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const team = await ctx.prisma.team.update({
          where: {
            id: input.id,
          },
          data: {
            payment_status: true,
          },
          include: {
            members: true,
          },
        });
        if (team) {
          team.members.map(async (member) => {
            const content: string = `Dear ${member.firstName} ${member.lastName},<br/><br/>
          Congratulations! We have successfully received your payment for the Studoindustry project. Your payment has been processed and approved, and we are excited to have you onboard.<br/><br/>
          Please find the details of the payment below:<br/>
          Payment Amount: 399/- <br/>
          Payment Method: UPI MODE<br/><br/>
          Your payment has been credited, and you can now proceed with your participation in the project. We appreciate your commitment and look forward to witnessing the valuable contributions you will make.<br/>
          If you have any questions or require any assistance, please do not hesitate to contact our support team at [Email: <a href="mailto:help.studoindustry@gmail.com">help.studoindustry@gmail.com</a> / Whatsapp Number: <a href="tel:+917620158234">+91 7620158234</a> ]. <br/><br/>
          Thank you for being a part of the Studoindustry community.<br/><br/>
          Best regards,<br/>
          The Studoindustry Team`;
            const info = await transporter.sendMail({
              from: '"Studo Industry" <studoindustry.com@gmail.com>',
              to: `${member.email}`,
              subject:
                'Payment Confirmation & Project Approval- Studoindustry Project',
              html: content,
            });
            console.log('Message sent: %s', info.messageId);
          });
        }
        return team;
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Something went wrong',
        });
      }
    }),
  rejectTeamPayment: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const team = await ctx.prisma.team.update({
          where: {
            id: input.id,
          },
          data: {
            orderStatus: false,
            paymentSS: null,
          },
          include: {
            members: true,
          },
        });
        if (team) {
          team.members.map(async (member) => {
            const content: string = `Dear ${member.firstName} ${member.lastName},<br/><br/>
            We regret to inform you that your payment for the Studoindustry project has been rejected. We apologize for any inconvenience this may cause.<br/><br/>
        Please find the details of the payment below:<br/><br/>
        We kindly request you to review the payment details and ensure that all the necessary information is accurate and up-to-date.<br/> If you believe there has been an error, please feel free to contact our support team at [Email: <a href="mailto:help.studoindustry@gmail.com">help.studoindustry@gmail.com</a> / Whatsapp Number: <a href="tel:+917620158234">+91 7620158234</a> ]. <br/><br/>
        Please note that your participation in the project will not be confirmed until the payment is successfully processed. You may resubmit the payment for further consideration.<br/>
        Thank you for your understanding. We value your interest in the project and hope to see you participate soon.<br/>

        Best regards,<br/>
        The Studoindustry Team`;
            const info = await transporter.sendMail({
              from: '"Studo Industry" <studoindustry.com@gmail.com>',
              to: `${member.email}`,
              subject: 'Congratulations on the approval of your payment!🥳',
              html: content,
            });
            console.log('Message sent: %s', info.messageId);
          });
        }
        return team;
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Something went wrong',
        });
      }
    }),
  paymentSSUpload: protectedProcedure
    .input(z.object({ extension: z.string() }))
    .mutation(({ input }) => {
      const ex = input.extension.split('/')[1]!;
      console.log(ex);
      const key = `${randomUUID()}.${ex}`;
      const params = {
        Bucket: process.env.AWS_BUCKET_SS,
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
  submitForPaymentApproval: protectedProcedure
    .input(z.object({ image: z.string(), teamid: z.string() }))
    .mutation(({ ctx, input }) => {
      const team = ctx.prisma.team.update({
        where: {
          id: input.teamid,
        },
        data: {
          paymentSS: input.image,
          orderStatus: true,
        },
      });
      return team;
    }),
});
