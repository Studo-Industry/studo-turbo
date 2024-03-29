import Link from 'next/link';

function Error() {
  return (
    <div className='flex h-[60vh] w-full flex-col items-center justify-center gap-4 text-lg'>
      <p className='font-bold'>
        Oops! Looks like you came to the wrong closet!
      </p>
      <Link href='/' className='text-blue underline'>
        Go Home
      </Link>
    </div>
  );
}

// Error.getInitialProps = ({ res, err }) => {
//   const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
//   return { statusCode };
// };

export default Error;
