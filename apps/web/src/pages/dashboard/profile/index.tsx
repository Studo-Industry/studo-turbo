import { getSession, useSession } from 'next-auth/react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Image from 'next/image';

import { api } from '~/utils/api';
import PreLoader from '~/components/PreLoader';
import { ProjectCard } from '~/components/Cards';

export async function getServerSideProps(context:GetServerSidePropsContext) {
  const session = await getSession(context);
  return {
    props: {
      data: session,
    },
  };
}

const Profile = ({data}:InferGetServerSidePropsType <typeof getServerSideProps>) => {

  const { data: userData, status: userStatus } = api.user.getOne.useQuery({
    id: data?.user?.id,
  });
  if (status === 'loading' || userStatus === 'loading') return <PreLoader />;
  if (userStatus === 'error')
    return <h2 className='text-xl'>Error loading data</h2>;
  return (
    <>
      <h1 className=' ml-20 mt-16 text-2xl'>My Profile</h1>
      <div className='my-24 flex flex-col gap-24 md:flex-row'>
        <div className='my-5 flex flex-col items-center justify-center gap-5 md:ml-44'>
          {data?.user?.image && (
            <Image
              height={200}
              width={200}
              src={data?.user?.image}
              alt='image user'
              className='rounded-full selection:border-4 hover:border-4'
            />
          )}
          <div className='flex flex-col'>
            <h2 className=' text-2xl font-bold'>{data?.user.name}</h2>
            <h2 className=' text-sm font-bold'>{data?.user.email}</h2>
          </div>
        </div>
        <div className='hidden h-auto w-1 bg-black md:block'></div>
        <div className='m-10 flex flex-col gap-10 md:m-0'>
          {userData?.team && userData?.team?.projectId ? (
            <>
              <h1 className=' text-xl' id='AppliedProject'>
                Projects Applied:
              </h1>
              <ProjectCard
                id={userData.team.projectId}
                title={userData.team.project.title}
                images={userData.team.project.images}
              />
            </>
          ) : (
            <div> No Projects applied yet</div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
