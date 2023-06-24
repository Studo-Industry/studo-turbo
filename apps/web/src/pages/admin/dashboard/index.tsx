import { GetServerSidePropsContext } from "next";
import { getSession, useSession } from "next-auth/react";

import PreLoader from "~/components/PreLoader";
import { api } from "~/utils/api";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  if (session.user.role !== "ADMIN") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      session,
    },
  };
}
const AdminDashboard = () => {
  const { data, status } = useSession();
  const { data: userData, status: userStatus } = api.user.getAll.useQuery();
  const { data: teamData, status: teamStatus } = api.team.getAll.useQuery();
  const { data: projectData, status: projectStatus } =
    api.project.getAll.useQuery();
  const { data: recentTeams, status: recentTeamsStatus } =
    api.team.getRecentTeams.useQuery();
  if (
    status === "loading" ||
    userStatus === "loading" ||
    projectStatus === "loading" ||
    recentTeamsStatus === "loading" ||
    teamStatus === "loading"
  )
    return <PreLoader />;
  return (
    <div className="mx-10 my-14">
      <h1 className="text-2xl font-semibold">Hi {data?.user.name},</h1>
      <div className="mx-5">
        <div className="my-12 flex flex-col justify-evenly gap-5 md:flex-row">
          <div className="rounded-lg bg-white px-10 py-5 text-center text-lg shadow-custom">
            <h2 className="font-semibold">Total Users</h2>
            <br />
            {userData?.length}
          </div>
          <div className="rounded-lg bg-white px-10 py-5 text-center text-lg shadow-custom">
            <h2 className="font-semibold">Total Teams</h2>
            <br />
            {teamData?.length}
          </div>
          <div className="rounded-lg bg-white px-10 py-5 text-center text-lg shadow-custom">
            <h2 className="font-semibold">Total Projects</h2>
            <br />
            {projectData?.length}
          </div>
        </div>
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
                  {team.referral_code}
                </td>
                <td className="border-collapse border-2  p-4">{team.leader}</td>
                <td className="border-collapse border-2  p-4">
                  {team.college}
                </td>
                <td className="border-collapse border-2  p-4">
                  {team.projectId}
                </td>
              </tbody>
            ))}
          </table>
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          { recentTeams?.map((team)=>
            <TeamCard code={team.referral_code} leader={team.leader}/>
          )
          }
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
