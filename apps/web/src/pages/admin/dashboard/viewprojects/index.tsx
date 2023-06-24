import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

import { env } from "~/env.mjs";
import { api } from "~/utils/api";
import img1 from "~/images/wallpaper.jpg";

const ViewProjects = () => {
  const { data: session, status: sessionStatus } = useSession();
  const { data: projects, status: projectStatus } =
    api.project.getAll.useQuery();
  const router = useRouter();

  if (sessionStatus === "unauthenticated") {
    void router.push("/");
  }

  if (projectStatus === "loading" || sessionStatus === "loading") {
    return (
      <div className="flex-center flex min-h-[60vh] w-full items-center justify-center align-middle text-2xl ">
        <h3>Loading...</h3>
      </div>
    );
  }
  if (projectStatus === "error") {
    return <h3> Error Loading data , Please try again.</h3>;
  }

  return (
    <div className="py-10">
      <h1 className="text-center text-3xl font-bold">Projects</h1>
      <div className="my-2 grid grid-cols-1 gap-3 px-10 py-10 md:grid-cols-3">
        {projects.map((project) => (
          <Link
            key={project.id}
            className="project rounded-2xl shadow-2xl"
            href={`/admin/dashboard/viewprojects/${project.id}`}
          >
            {project.images.length !== 0 ? (
              <img
                src={String(env.NEXT_PUBLIC_AWS_S3) + String(project.images[0])}
                alt={project.title}
                className="max-w-48 mx-auto  mb-5 mt-8 max-h-48 rounded-md"
              />
            ) : (
              <img
                className="max-w-48 mx-auto  mb-5 mt-8 max-h-48 rounded-md"
                src={img1.src}
              />
            )}
            <h1 className="mb-8 px-4 text-center text-sm font-bold">
              {project.title}
            </h1>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ViewProjects;
