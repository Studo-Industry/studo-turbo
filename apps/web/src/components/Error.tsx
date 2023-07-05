import { useRouter } from 'next/router';

const Error = ({ error }: { error: string }) => {
  const router = useRouter();
  return (
    <div className='flex h-[60vh] w-full flex-col items-center justify-center gap-4 text-lg'>
      <p className='font-bold'>Oops! Looks like something went wrong!</p>
      <p>{error}</p>
      <button className='text-orange underline' onClick={() => router.back()}>
        Go back
      </button>
    </div>
  );
};

// Error.getInitialProps = ({ res, err }) => {
//   const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
//   return { statusCode };
// };

export default Error;
