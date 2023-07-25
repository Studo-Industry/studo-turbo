import React from 'react'
import { api } from '~/utils/api'

const RecentTeamTable = ({recentTeams}) => {
  return (
    <div>
        <div>
          <h2 className="mb-6 font-bold">Recent Teams</h2>
          <table className="table-fixed border-collapse rounded-lg border-2 shadow-custom">
            <thead className="border-collapse border-2  p-4">
              <th className="border-collapse border-2  p-4">Team Code</th>
              <th className="border-collapse border-2  p-4">Leader</th>
              <th className="border-collapse border-2  p-4">Collage</th>
              <th className="border-collapse border-2  p-4">Project</th>
            </thead>

            {recentTeams?.map((team) => (
              <tbody key={team.id} className="border-collapse border-2  p-4">
                <td className="border-collapse border-2  p-4">
                  {team?.referral_code}
                </td>
                <td className="border-collapse border-2  p-4">{team.members[0].name}</td>
                <td className="border-collapse border-2  p-4">
                  {team?.college}
                </td>
                <td className="border-collapse border-2  p-4">
                  {team?.project?.title}
                </td>
              </tbody>
            ))}
          </table>
        </div>
    </div>
  )
}

export default RecentTeamTable