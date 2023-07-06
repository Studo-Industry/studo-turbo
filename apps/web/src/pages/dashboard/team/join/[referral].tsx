import React, { useState } from 'react';
import { BsLightningFill } from 'react-icons/bs';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { getSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';

import PreLoader from '~/components/PreLoader';
import { api } from '~/utils/api';
import { env } from '~/env.mjs';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: `${env.NEXTAUTH_URL}/auth/signin?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2Fdashboard%2Fteam%2Fjoin%2F${context.params.referral}`,
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

const JoinTeam = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  let toastid: string;
  const router = useRouter();
  const mutate = api.team.join.useMutation({
    onMutate: () => {
      toast.loading('Joining team..', { id: toastid });
    },
    onSuccess: () => {
      toast.dismiss(toastid);
      toast.success('Joined team successfully', { id: toastid });
      void router.push('/dashboard/team');
    },
    onError: (error) => {
      toast.dismiss(toastid);
      toast.error(`Error: ${error.message}`, {
        id: toastid,
      });
    },
  });

  const { data: teamData, status } = api.team.getTeamByReferral.useQuery({
    referral: String(router.query.referral),
  });

  if (status === 'loading') return <PreLoader />;
  if (status === 'error') return <p>Error loading data...</p>;
  return (
    <div className='flex min-w-full flex-col items-center justify-center gap-10 p-10 '>
      <div className=' flex w-4/5 flex-col items-center gap-20 rounded-xl px-10 py-20 shadow-xl'>
        <h3 className='text-xl font-bold'>
          Do you want to join {teamData.college} team?
        </h3>
        <div className='flex w-full flex-col gap-2'>
          <p className='font-bold'>Team Details</p>
          <p>
            Project -{' '}
            <span className='font-bold'> {teamData.project.title}</span>
          </p>
          <p>Members</p>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            {teamData.members.map((member) => (
              <div
                key={member.id}
                className='flex items-center gap-4 rounded-md p-4 shadow-lg'
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  width={40}
                  height={40}
                  className='rounded-full'
                />
                <p>{member.name}</p>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={() => {
            void mutate.mutateAsync({
              referral: teamData.referral_code,
            });
            document.body.style.overflow = 'unset';
          }}
          className='Button gradient-btn blue-orange-gradient hover:orange-white-gradient  flex justify-center bg-gradient-to-bl text-base drop-shadow-lg hover:font-semibold hover:text-white'
        >
          <p className='mr-1 text-xl'>
            <BsLightningFill />
          </p>
          Join Team
        </button>
      </div>
    </div>
  );
};

export default JoinTeam;
