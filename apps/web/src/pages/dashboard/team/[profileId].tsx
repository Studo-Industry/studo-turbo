import Image from "next/image";
import { useRouter } from "next/router";

import { api } from "~/utils/api";
import PreLoader from "~/components/PreLoader";
import { ProjectCard } from "~/components/Cards";

const Profile = () => {
  const router = useRouter();

  const { data, status } = api.user.getOne.useQuery({
    id: String(router.query.profileId),
  });

  if (status === "loading") return <PreLoader />;
  if (status === "error")
    return <h2 className="text-xl">Error Loading Data</h2>;
  return (
    <>
      <h1 className=" ml-20 mt-16 text-2xl">
        <span className="font-bold">{data?.name}&#39;s</span> Profile
      </h1>
      <div className="my-24 flex flex-col gap-24 md:flex-row">
        <div className="my-5 flex flex-col items-center justify-center gap-5 md:ml-44">
          {data?.image && (
            <Image
              height={200}
              width={200}
              src={data?.image}
              alt="image user"
              className="rounded-full selection:border-4 hover:border-4"
            />
          )}
          <div className="flex flex-col">
            <h2 className=" text-2xl font-bold">{data?.name}</h2>
            <h2 className=" text-sm font-bold">{data?.email}</h2>
          </div>
        </div>
        <div className="hidden h-auto w-1 bg-black md:block"></div>
        <div className="m-10 flex flex-col gap-10 md:m-0">
          {data?.team && data?.team?.projectId ? (
            <>
              <h1 className=" text-xl" id="AppliedProject">
                Projects Applied:
              </h1>
              <div className=" rounded-md p-5 shadow-xl">
                <ProjectCard
                  id={data.team.projectId}
                  images={data.team.project.images}
                  title={data.team.project.title}
                />
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
