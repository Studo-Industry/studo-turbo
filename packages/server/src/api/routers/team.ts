import { TRPCClientError } from '@trpc/client';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';

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
      const teamCheck = await ctx.prisma.project.findUnique({
        where: { id: input.projectId },
        include: { Team: true },
      });
      if (teamCheck) {
        console.log(teamCheck.Team.length);
        if (teamCheck.Team.length >= 25) {
          throw new Error('Project Slots already full!');
        }
        const team = teamCheck.Team.find(
          (team) => team.college === input.college,
        );
        if (team !== undefined)
          throw new Error('Your College Team already exists for this project.');
      }
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        include: {
          team: true,
        },
      });
      if (user?.teamId !== null) {
        throw new Error('Team already exists');
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
        },
      });
      await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          teamId: team.id,
        },
      });
      return team;
    }),
  join: protectedProcedure
    .input(z.object({ referral: z.string(), type: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const team = await ctx.prisma.team.findUnique({
          where: {
            referral_code: input.referral,
          },
          include: {
            members: true,
          },
        });

        if (team) {
          if (team.members.length >= 5) {
            throw new Error('Team is full');
          } else {
            const user = await ctx.prisma.user.update({
              where: {
                id: ctx.session.user.id,
              },
              data: {
                teamId: team?.id,
              },
            });

            if (input.type === 'mentor') {
              if (team.mentor === null) {
                if (team.leader !== ctx.session.user.id) {
                  const mentorTeam = await ctx.prisma.team.update({
                    where: {
                      id: team?.id,
                    },
                    data: {
                      mentor: user.id,
                    },
                  });
                } else {
                  throw new Error('Leader cannot be mentor.');
                }
              } else {
                throw new Error('Mentor already exists');
              }
            }
            return user;
          }
        } else {
          throw new Error('Referral Code is wrong.');
        }
      } catch (error) {
        console.log(error);
        throw new Error('' + error);
      }
    }),
  getTeam: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const team = await ctx.prisma.team.findFirst({
          where: {
            leader: input.id,
          },
          include: {
            members: true,
            project: true,
          },
        });
        console.log(team, input.id);
        return team;
      } catch (error) {
        console.log(error);
        throw new Error('error creating team');
      }
    }),
  mileStoneSubmit: protectedProcedure
    .input(
      z.object({
        milestone: z.number().max(6).min(1),
        files: z.string().array(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await ctx.prisma.user.findUnique({
          where: { id: ctx.session.user.id },
        });
        let team;
        if (user) {
          switch (input.milestone) {
            case 1:
              team = await ctx.prisma.team.update({
                where: {
                  id: user.teamId!,
                },
                data: {
                  milestone1: {
                    push: input.files,
                  },
                  presentMilestone: 2,
                },
              });
              break;
            case 2:
              team = await ctx.prisma.team.update({
                where: {
                  id: user.teamId!,
                },
                data: {
                  milestone2: {
                    push: input.files,
                  },
                  presentMilestone: 3,
                },
              });
              break;
            case 3:
              team = await ctx.prisma.team.update({
                where: {
                  id: user.teamId!,
                },
                data: {
                  milestone3: {
                    push: input.files,
                  },
                  presentMilestone: 4,
                },
              });
              break;
            case 4:
              team = await ctx.prisma.team.update({
                where: {
                  id: user.teamId!,
                },
                data: {
                  milestone4: {
                    push: input.files,
                  },
                  presentMilestone: 5,
                },
              });
              break;
            case 5:
              team = await ctx.prisma.team.update({
                where: {
                  id: user.teamId!,
                },
                data: {
                  milestone5: {
                    push: input.files,
                  },
                  presentMilestone: 6,
                },
              });
              break;
            case 6:
              team = await ctx.prisma.team.update({
                where: {
                  id: user.teamId!,
                },
                data: {
                  milestone6: {
                    push: input.files,
                  },
                  presentMilestone: 7,
                },
              });
              break;
            default:
              return new Error('Some error occured, try again');
          }
          return team;
        }
      } catch (error) {
        console.log(error);
        throw new Error('User doesnt exist');
      }
    }),
  getMilestone: protectedProcedure.query(async ({ ctx }) => {
    try {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        include: {
          team: true,
        },
      });
      if (user) {
        if (user.team?.milestone1.length === 0) return 1;
        if (user.team?.milestone2.length === 0) return 2;
        if (user.team?.milestone3.length === 0) return 3;
        if (user.team?.milestone4.length === 0) return 4;
        if (user.team?.milestone5.length === 0) return 5;
        if (user.team?.milestone6.length === 0) return 6;
      }
    } catch (error) {
      console.log(error);
      throw new Error('User doesnt exist');
    }
  }),
});