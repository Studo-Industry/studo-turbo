import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { env } from "~/env.mjs";
import { api } from "~/utils/api";
import img1 from "~/images/wallpaper.jpg";
import { useRouter } from "next/router";

const Profile = () => {
  const router = useRouter();
  const { data, status } = useSession();

  const { data: userData, status: userStatus } = api.user.getOne.useQuery({
    id: data?.user?.id!,
  });
  return (
    <>
      <h1 className=" ml-20 mt-16 text-2xl">My Profile</h1>
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
        <div className="m-10 flex flex-col gap-10 md:m-0">
          {userData?.team && userData?.team?.projectId ? (
            <>
              <h1 className=" text-xl" id="AppliedProject">
                Projects Applied:
              </h1>
              <div className=" rounded-md p-5 shadow-xl">
                <Link
                  className="rounded-2xl shadow-2xl"
                  href={`/dashboard/projects/${userData?.team?.projectId}`}
                >
                  {userData?.team?.project.images.length !== 0 ? (
                    <img
                      src={
                        String(env.NEXT_PUBLIC_AWS_S3) +
                        String(userData?.team?.project.images[0])
                      }
                      alt={userData?.team?.project.title}
                      className="max-w-48 mx-auto mb-5 mt-8 max-h-48 rounded-md"
                    />
                  ) : (
                    <img
                      className="max-w-48 mx-auto mb-5 mt-8 max-h-48 rounded-md"
                      src={img1.src}
                    />
                  )}
                  <h1 className="mb-8 px-4 text-center text-sm font-bold">
                    {userData?.team?.project.title}
                  </h1>
                </Link>
              </div>
            </>
          ) : (
            <div> No Projects applied yet</div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
