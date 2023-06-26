import React, { useState } from 'react';
import { BsLightningFill } from 'react-icons/bs';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
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
  const [role, setRole] = useState('member');
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
      toast.error(`Error occured ${error.message}`, { id: toastid });
      // console.log(error);
    },
  });

  const { data: teamData, status } = api.team.getTeamByReferral.useQuery({
    referral: String(router.query.referral),
  });

  if (status === 'loading') return <PreLoader />;
  if (status === 'error') return <p>Error loading data...</p>;
  return (
    <div className='flex min-w-full flex-col items-center justify-center gap-10 p-10 '>
      <h3 className='text-xl font-bold'>
        Do you want to join {teamData.college} team?
      </h3>
      <div className=' flex w-4/5 flex-col gap-10 rounded-xl p-10 shadow-xl'>
        <label className='mr-3 text-sm font-semibold'>Choose Your Role:</label>
        <select
          id='cars'
          name='cars'
          value={role}
          onChange={(event) => setRole(event.target.value)}
          className='border-grey-600 rounded-full border-2 bg-white p-3 px-5 '
        >
          <option value='member'>Member</option>
          <option value='mentor'>Mentor</option>
        </select>
        <button
          onClick={() => {
            void mutate.mutateAsync({
              referral: teamData.referral_code,
              type: role,
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
