import Link from 'next/link';
import { useRouter } from 'next/router';

const Thankyou = () => {
  const router = useRouter();
  const team = String(router.query.teamId);
  return (
    <div className='flex h-[50vh] w-full flex-col items-center justify-center'>
      <p className='text-2xl font-bold'>Thank you for the purchase!</p>
      <Link href={`/dashboard/team/${team}`} className='text-blue underline'>
        Go Back to Team Page
      </Link>
    </div>
  );
};

export default Thankyou;
