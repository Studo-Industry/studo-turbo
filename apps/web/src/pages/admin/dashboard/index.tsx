import { GetServerSidePropsContext } from "next";
import { getSession, useSession } from "next-auth/react";
import Admins from "~/components/Admins";
import Mentors from "~/components/Mentors";

import PreLoader from "~/components/PreLoader";
import RecentTeamTable from "~/components/RecentTeam";
import Users from "~/components/Users";
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
      <title>Admin Dashboard</title>
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
          <RecentTeamTable recentTeams={recentTeams} />
        </div>
        <div className="my-10">
          <Users/> 
        </div>
        <div className="my-10">
          <Mentors/> 
        </div>
        <div className="my-10">
          <Admins/> 
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
