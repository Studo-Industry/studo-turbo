import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import { getProviders, signIn } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import { FaDiscord, FaGithub, FaGoogle } from 'react-icons/fa';
import { IoLogInOutline } from 'react-icons/io5';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';

import { authOptions } from 'server';
import LOGO from '~/images/studoindustry logo.png';

const style = (id: string) => {
  if (id === 'google') {
    return { borderColor: '#ff0000' };
  }
  if (id === 'discord') {
    return { borderColor: '#7289da' };
  }
  if (id === 'github') {
    return { borderColor: '#000000' };
  }
  return { borderColor: '#aaaaaa' };
};
const logo = (id: string) => {
  if (id === 'google') {
    return <FaGoogle size={30} color='#ff0000' />;
  }
  if (id === 'discord') {
    return <FaDiscord size={30} color='#7289da' />;
  }
  if (id === 'github') {
    return <FaGithub size={30} color='#000000' />;
  }
  return <IoLogInOutline size={30} color='#000000' />;
};

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { error } = useRouter().query;

  return (
    <div className='z-100 absolute left-0 top-0 flex h-[100vh] w-full flex-col items-center justify-center bg-white md:px-96'>
      <div className='my-20 flex min-h-full min-w-full flex-col items-center justify-center gap-10 p-10 '>
        <Image src={LOGO} width={130} height={40} alt='LOGO' />

        {error && <SignInError error={error} />}
        <p className='text-xl font-bold'>Sign In With</p>
        {Object.values(providers).map((provider) => (
          <button
            key={provider.name}
            className='flex w-10/12 items-center justify-center gap-8  rounded-md border-4 p-4 text-lg font-semibold md:w-4/12'
            onClick={() => signIn(provider.id)}
            style={style(provider.id)}
          >
            {logo(provider.id)}
            {provider.name}
          </button>
        ))}
      </div>
    </div>
  );
}

const errors = {
  Signin: 'Try signing with a different account.',
  OAuthSignin: 'Try signing with a different account.',
  OAuthCallback: 'Try signing with a different account.',
  OAuthCreateAccount: 'Try signing with a different account.',
  EmailCreateAccount: 'Try signing with a different account.',
  Callback: 'Try signing with a different account.',
  OAuthAccountNotLinked:
    'To confirm your identity, sign in with the same account you used originally.',
  EmailSignin: 'Check your email address.',
  CredentialsSignin:
    'Sign in failed. Check the details you provided are correct.',
  default: 'Unable to sign in.',
};

const SignInError = ({ error }) => {
  const errorMessage = error && (errors[error] ?? errors.default);
  return (
    <div className='rounded-md bg-red-500 p-4  text-white'>{errorMessage}</div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return {
      redirect: { destination: context.query.callbackUrl || '/dashboard' },
    };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}
