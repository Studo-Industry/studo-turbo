import Link from 'next/link';
import { useRouter } from 'next/router';
import Error from '~/components/Error';
import PreLoader from '~/components/PreLoader';
import { api } from '~/utils/api';

const Thankyou = () => {
  const router = useRouter();
  const team = String(router.query.teamId);
  const orderId = String(router.query.orderId);
  const { data, status } = api.payment.verify.useQuery(
    {
      orderId: String(orderId),
    },
    { retry: false },
  );
  if (status === 'loading') return <PreLoader />;
  if (status === 'error')
    return (
      <Error error='Something went wrong, please contact admin to resolve if your payment went through.' />
    );
  console.log(data);
  return (
    <div className='flex h-[50vh] w-full flex-col items-center justify-center'>
      <p className='text-2xl font-bold'>Thank you for the purchase!</p>
      {data.status === 'PENDING' && data.message}
      {data.status === 'SUCCESS' && data.message}
      <Link href={`/dashboard/team/${team}`} className='text-blue underline'>
        Go Back to Team Page
      </Link>
    </div>
  );
};

export default Thankyou;
