import { GetServerSidePropsContext } from "next";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";

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
  return <div>AdminDashboard</div>;
};

export default AdminDashboard;
