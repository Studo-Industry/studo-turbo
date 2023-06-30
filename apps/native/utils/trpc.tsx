import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createTRPCReact, httpBatchLink } from '@trpc/react-query';
import superjson from 'superjson';

import { type AppRouter } from 'server';

/**
 * A set of typesafe hooks for consuming your API.
 */

export const api = createTRPCReact<AppRouter>();
export { type RouterInputs, type RouterOutputs } from 'server';

/**
 * Extend this function when going to production by
 * setting the baseUrl to your production API URL.
 */
// const getBaseUrl = () => {
//   /**
//    * Gets the IP address of your host-machine. If it cannot automatically find it,
//    * you'll have to manually set it. NOTE: Port 3000 should work for most but confirm
//    * you don't have anything else running on it, or you'd have to change it.
//    *
//    * **NOTE**: This is only for development. In production, you'll want to set the
//    * baseUrl to your production API URL.
//    */
//   enableScreens(true);
//   const { manifest } = Constants;

//   const localhost = `http://${manifest.debuggerHost?.split(':').shift()}:3000`;
//   if (localhost) return localhost;
//   return `http://192.168.1.12:3000`;
// };

/**
 * A wrapper for your app that provides the TRPC context.
 * Use only in _app.tsx
 */
export const TRPCProvider: React.FC<{
  children: string | JSX.Element | JSX.Element[];
}> = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    api.createClient({
      transformer: superjson,
      links: [
        httpBatchLink({
          // url: 'http://192.168.0.106:3000/api/trpc',
          url: 'http://10.10.10.176:3000/api/trpc',
        }),
      ],
    }),
  );

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </api.Provider>
  );
};
