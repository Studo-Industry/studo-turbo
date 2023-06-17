import { useSession } from "next-auth/react";
import Link from "next/link";
import { env } from "~/env.mjs";
import { api } from "~/utils/api";
import img1 from "~/images/wallpaper.jpg";

const Wishlist = () => {
  const session = useSession();
  const { data: user, status: userStatus } = api.user.getOne.useQuery({
    id: session.data?.user.id!,
  });
  return (
    <div className="px-8 py-20 md:px-20">
      <h2 className="pb-10 text-xl font-bold">Wishlist</h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {userStatus === "loading" && <h2 className="text-xk">Loading..</h2>}
        {userStatus === "error" && (
          <h2 className="text-xk">Error Loading Data please try again..</h2>
        )}
        {userStatus === "success" ? (
          user?.wishlist.length !== 0 ? (
            user?.wishlist.map((project) => (
              <Link
                key={project.id}
                className="project rounded-2xl shadow-2xl"
                href={`/dashboard/projects/${project.id}`}
              >
                {project.images.length !== 0 ? (
                  <img
                    src={
                      String(env.NEXT_PUBLIC_AWS_S3) + String(project.images[0])
                    }
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
            ))
          ) : (
            <p>No wishlisted Projects yet</p>
          )
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
