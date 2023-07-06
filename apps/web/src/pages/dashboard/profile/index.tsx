import { getSession } from 'next-auth/react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Image from 'next/image';

import { api } from '~/utils/api';
import PreLoader from '~/components/PreLoader';
import { ProjectCard } from '~/components/Cards';
import Error from '~/components/Error';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);
  return {
    props: {
      data: session,
    },
  };
}

const Profile = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: userData, status: userStatus } = api.user.getOne.useQuery({
    id: data?.user?.id,
  });
  const contact = String(userData?.contact);
  if (status === 'loading' || userStatus === 'loading') return <PreLoader />;
  if (userStatus === 'error')
    return <Error error='Error Loading data, Please try again in some time.' />;
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
          <p className='text-xl'>
            Full Name: {userData.firstName} {userData.middleName}{' '}
            {userData.lastName}
          </p>
          <p className='text-xl'>College: {userData.college}</p>
          <p className='text-xl'>Branch: {userData.branch}</p>
          <p className='text-xl'>Year: {userData.year}</p>
          <p className='text-xl'>Contact: {contact}</p>
          {/* {userData?.team && userData?.team?.projectId ? (
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
          )} */}
        </div>
      </div>
    </>
  );
};

export default Profile;
