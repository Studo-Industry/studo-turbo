import { useRouter } from "next/router";
import Image from "next/image";
import { useSession } from "next-auth/react";

import { api } from "~/utils/api";

const Profile = () => {
  const router = useRouter();
  const { data, status } = useSession();

  const { data: userData, status: userStatus } = api.user.getOne.useQuery({
    id: data?.user?.id!,
  });
  return (
    <>
      <title>Admin Profile</title>
      <h1 className=" ml-20 mt-16 text-2xl">My Profile,</h1>
      <div className="my-24 flex flex-col gap-24 md:flex-row">
        <div className="my-5 flex flex-col items-center justify-center gap-5 md:ml-44">
          {data?.user?.image && (
            <Image
              height={200}
              width={200}
              src={data?.user?.image}
              alt="image user"
              className="rounded-full selection:border-4 hover:border-4"
            />
          )}
          <div className="flex flex-col">
            <h2 className=" text-2xl font-bold">{data?.user.name}</h2>
            <h2 className=" text-sm font-bold">{data?.user.email}</h2>
          </div>
        </div>
        <div className="hidden h-auto w-1 bg-black md:block"></div>
        <div className="m-10 flex flex-col justify-center gap-10 md:m-0">
          <h3 className="text-2xl">Name: {userData?.name}</h3>
          <h3 className="text-2xl">Email: {userData?.email}</h3>
          <h3 className="text-2xl">Role: {userData?.role}</h3>
        </div>
      </div>
    </>
  );
};

export default Profile;
