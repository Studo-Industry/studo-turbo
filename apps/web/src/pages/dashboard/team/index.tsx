import Link from 'next/link';
import { getSession } from 'next-auth/react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';

import { api } from '~/utils/api';
import { env } from '~/env.mjs';
import img1 from '~/images/wallpaper.jpg';
import PreLoader from '~/components/PreLoader';
import Error from '~/components/Error';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return {
    props: {
      data: session,
    },
  };
}

const Teams = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: userData, status: userStatus } = api.user.getOne.useQuery({
    id: data?.user?.id,
  });

  if (userStatus === 'loading') return <PreLoader />;
  // if (milestoneData === undefined) return <h2>Error loading data...</h2>;
  if (userStatus === 'error')
    return <Error error='Error Loading data, Please try again in some time.' />;

  if (userData?.team.length === 0) return <Error error='Team doesnt exist' />;

  return (
    <div className='px-8 py-20 md:px-20'>
      <h2 className='mb-10 text-2xl font-bold'>My Teams</h2>
      <div className='grid grid-cols-1 md:grid-cols-3'>
        {userData.team.map((team) => (
          <Link
            href={`/dashboard/team/${team.id}`}
            key={team.id}
            className='flex flex-col gap-4 rounded-md p-6 shadow-md'
          >
            {team.project.images.length === 0 ? (
              <img src={img1.src} alt='project img' className='rounded-md' />
            ) : (
              <img
                src={String(env.NEXT_PUBLIC_AWS_S3) + team.project.images[0]}
                alt='heeh'
                className='rounded-md'
              />
            )}
            <div>
              <span
                className={` rounded-md p-2 text-white ${
                  team.payment_status ? 'bg-green-500' : 'bg-red-500'
                }`}
              >
                {team.payment_status ? 'Paid' : 'Unpaid'}
              </span>
            </div>
            <div>
              <p className='font-bold'>{team.project.title}</p>
              <p>Number of members - {team.members.length}</p>
              <p>Team created at - {team.appliedAt.toLocaleString()}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Teams;
