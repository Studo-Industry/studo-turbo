import { getSession } from 'next-auth/react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';

import { api } from '~/utils/api';
import PreLoader from '~/components/PreLoader';
import Error from '~/components/Error';
import Button from '~/components/Button';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);
  if (session) {
    return {
      props: {
        data: session,
      },
    };
  } else {
    return {
      props: {
        redirect: {
          destination: '/',
          permanent: false,
        },
      },
    };
  }
}

const Profile = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { data: userData, status: userStatus } = api.user.getOne.useQuery({
    id: data?.user?.id,
  });

  if (userStatus === 'loading') return <PreLoader />;
  if (userStatus === 'error')
    return <Error error='Error Loading data, Please try again in some time.' />;

  return (
    <div className='mx-10 my-10 md:mx-20'>
      <div className='my-4 grid grid-cols-1 md:my-10 md:grid-cols-4'>
        <div className='flex flex-row items-center justify-center gap-4'>
          <div className='flex flex-col items-center justify-center gap-5'>
            <img
              src={userData.image}
              alt='profile picture'
              className='h-52 w-52 rounded-full'
            />
            <p>{userData.name}</p>
          </div>
          <div className='hidden h-full w-1 bg-gray-500 md:block' />
        </div>
        <div className='col-span-3 flex flex-col gap-6'>
          <div>
            <p className='font-bold'>Full Name:</p>
            <p>
              {userData.firstName +
                ' ' +
                userData.middleName +
                ' ' +
                userData.lastName}
            </p>
          </div>
          <div>
            <p className='font-bold'>Email Address:</p>
            <p>{userData.email}</p>
          </div>
          <div>
            <p className='font-bold'>Phone Number:</p>
            <p>{Number(userData.contact)}</p>
          </div>
          <div>
            <p className='font-bold'>College:</p>
            <p>{userData.college}</p>
          </div>
          <div>
            <p className='font-bold'>Branch:</p>
            <p>{userData.branch}</p>
          </div>
          <div>
            <p className='font-bold'>Year:</p>
            <p>{userData.year}</p>
          </div>
          <div className='flex gap-4'>
            <Button
              type='normal'
              onClick={() => router.push('/dashboard/team')}
            >
              View Team
            </Button>
            <Button
              type='outline'
              onClick={() => router.push('/dashboard/profile/wishlist')}
            >
              View Wishlist
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
