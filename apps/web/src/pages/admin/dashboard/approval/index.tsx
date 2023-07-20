import React from 'react';
import { ApprovalTeamCard } from '~/components/Cards';
import Error from '~/components/Error';
import PreLoader from '~/components/PreLoader';
import { api } from '~/utils/api';

const approval = () => {
  const { data: teamsData, status: teamsStatus } =
    api.team.getApprovalRequestingTeams.useQuery();
  if (teamsStatus === 'loading') {
    return <PreLoader />;
  }
  if (teamsStatus === 'error') {
    return <Error error='Errorrrrr' />;
  }
  return (
    <div className='m-10'>
      <h1 className='mb-10 text-center text-3xl font-bold'>Payment Approval</h1>
      <div className='grid grid-cols-2 gap-6'>
        {teamsData?.map((team) => {
          return <ApprovalTeamCard team={team} key={team.id} />;
        })}
      </div>
    </div>
  );
};

export default approval;
