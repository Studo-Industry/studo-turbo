import { exampleRouter } from './routers/example';
import { createTRPCRouter } from './trpc';
import { projectRouter } from './routers/project';
import { teamRouter } from './routers/team';
import { collegeRouter } from './routers/college';
import { userRouter } from './routers/user';
import { paymentRouter } from './routers/payment';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  project: projectRouter,
  team: teamRouter,
  college: collegeRouter,
  user: userRouter,
  payment: paymentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
