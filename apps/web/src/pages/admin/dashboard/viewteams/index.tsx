import React from "react";
import { AdminTeamCard } from "~/components/Cards";

import { api } from "~/utils/api";

const index = () => {
  const { data: teamData, status: teamStatus } = api.team.getAll.useQuery();
  return (
    <div className="px-10 py-10">
      <title>Teams</title>
      <h1 className="mb-10 text-center text-3xl font-bold">Teams</h1>
      <div className="grid grid-cols-2 gap-5">
        {teamData?.map((team) => (
          <AdminTeamCard
            key={team.id}
            code={team.referral_code}
            leader={team.leader}
          />
        ))}
      </div>
    </div>
  );
};

export default index;
