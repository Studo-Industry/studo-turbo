import type { AppType } from 'next/app';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { Analytics } from '@vercel/analytics/react';

import '~/styles/globals.css';
import Layout from '~/components/Layout';
import { api } from '~/utils/api';

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
        <Analytics />
      </Layout>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
