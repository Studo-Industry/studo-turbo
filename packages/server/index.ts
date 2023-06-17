import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server';

import { type AppRouter } from './src/api/root';

export { appRouter, type AppRouter } from './src/api/root';
export { createTRPCContext } from './src/api/trpc';

/**
 * Inference helpers for input types
 * @example type HelloInput = RouterInputs['example']['hello']
 **/
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helpers for output types
 * @example type HelloOutput = RouterOutputs['example']['hello']
 **/
export type RouterOutputs = inferRouterOutputs<AppRouter>;
export { type Session } from 'next-auth';
export { getServerAuthSession, authOptions } from './src/auth';
