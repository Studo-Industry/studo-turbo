import Link from "next/link";
import { useRouter } from "next/router";
import { Team } from "@prisma/client";
import { AiOutlineLeft } from "react-icons/ai";

import ImageCarousel from "~/components/ImageCarousel";
import { env } from "~/env.mjs";
import img1 from "~/images/wallpaper.jpg";
import { api } from "~/utils/api";

const Project = () => {
  let toastId: string;
  const router = useRouter();

  const { data, status } = api.project.getOne.useQuery({
    id: String(router.query.id),
  });

  if (status === "loading") {
    return <h1 className="p-20 text-2xl">Loading</h1>;
  }
  if (status === "error") {
    return (
      <h1 className="p-20 text-2xl">Error loading data , Please try again!</h1>
    );
  }
  if (data === null) {
    return "Error Loading Data";
  }

  return (
    <div>
      <div className="m-10 md:m-20">
        <div className="">
          <Link
            href="/admin/dashboard/"
            className="ml-16 flex flex-row items-center gap-2 font-medium"
          >
            <AiOutlineLeft />
            <span> Go Back</span>
          </Link>

          <div className="flex flex-col gap-8 pt-9  md:flex-row">
            <div
              className="flex flex-1 items-center justify-center rounded-lg bg-white p-4
                text-center font-normal text-gray-600 shadow-xl"
            >
              <div className="rounded-lg bg-slate-400">
                {data?.images.length !== 0 ? (
                  <ImageCarousel>
                    {data?.images.map((s, i) => (
                      <img
                        src={`${env.NEXT_PUBLIC_AWS_S3}${s}`}
                        key={i}
                        className="max-h-96 min-w-full"
                      />
                    ))}
                  </ImageCarousel>
                ) : (
                  <img src={img1.src} alt="replacement image" />
                )}
              </div>
            </div>
            <div
              className="flex-1 rounded-lg bg-white
                 px-10 py-10 text-gray-600 shadow-xl"
            >
              <div className="mb-6 flex flex-wrap justify-between">
                <h1 className=" text-2xl font-bold">{data?.title}</h1>
                {data?.paidProject && (
                  <div className="gradient-btn blue-orange-gradient hover:orange-white-gradient flex h-10 w-20  items-center justify-center bg-gradient-to-bl text-base drop-shadow-lg hover:font-semibold hover:text-white">
                    Paid
                  </div>
                )}
              </div>
              <div className="mb-6">
                <p>
                  Company- <span className="font-bold">{data?.company}</span>
                </p>
              </div>
              <div className="mb-6">
                <p>Categories-</p>
                <div className="my-4 flex flex-wrap gap-4">
                  {data?.categories.map((category, index) => (
                    <p key={index} className="rounded-full border-2 px-4 py-2">
                      {category}
                    </p>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <p>Tags-</p>
                <p className="flex gap-4 py-4 text-sm">
                  {data?.tags.map((tag, index) => (
                    <span className=" text-black/75" key={index}>
                      #{tag}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className=" mb-20 whitespace-pre-wrap rounded-lg p-10 text-gray-600 shadow-xl ">
          {data?.description && (
            <>
              <h2 className="pb-3 text-xl font-medium text-black">
                Description
              </h2>
              <p>{data?.description}</p>
            </>
          )}
          {data?.videoLink && (
            <>
              <h2 className="pb-3 text-xl font-medium text-black">
                Description
              </h2>
              <p>{data?.videoLink}</p>
            </>
          )}
          {data?.features && (
            <>
              <h2 className="pb-3 pt-7 text-xl font-medium text-black">
                Features
              </h2>
              <p>{data?.features}</p>
            </>
          )}
          {data?.implementation && (
            <>
              <h2 className="pb-3 pt-7 text-xl font-medium  text-black">
                Implementation
              </h2>
              <p>{data?.implementation}</p>
            </>
          )}
          {data?.components && (
            <>
              <h2 className="pb-3 pt-7 text-xl font-medium  text-black">
                Components
              </h2>
              <p>{data?.components}</p>
            </>
          )}
          {data?.specifications && (
            <>
              <h2 className="pb-3 pt-7 text-xl font-medium  text-black">
                Specifications
              </h2>
              <p>{data?.specifications}</p>
            </>
          )}
          {data?.skills && (
            <>
              <h2 className="pb-3 pt-7 text-xl font-medium text-black">
                Skills
              </h2>
              <p>{data?.skills}</p>
            </>
          )}
          {data?.relatedInfo && (
            <>
              <h2 className="pb-3 pt-7 text-xl font-medium text-black">
                Other Related Information
              </h2>
              <p>{data?.relatedInfo}</p>
            </>
          )}
        </div>
        <div className="flex flex-col gap-10 rounded-lg p-8 shadow-lg">
          <h2 className="text-2xl font-bold">Ranking</h2>
          <div className="grid grid-cols-3 md:grid-cols-6">
            <p>Rank</p>
            <p className="md:col-span-2">College</p>
            <p className="col-span-1 md:col-span-3">Progress</p>
          </div>
          <div className="flex flex-col gap-4">
            {data.Team.map((team, index) => (
              <TeamCard key={team.id} team={team} index={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Project;

const TeamCard = ({ team, index }: { team: Team; index: number }) => {
  const width = [
    "w-[16.66%]",
    "w-[33.32%]",
    "w-[49.98%]",
    "w-[66.64]",
    "w-[83.33]",
    "w-full",
  ];
  return (
    <div className="grid grid-cols-3 items-center gap-4 rounded-md p-4 shadow-lg md:grid-cols-6">
      <p>{index + 1}</p>
      <p className="md:col-span-2">{team.college}</p>
      <p>{Math.round(((team.presentMilestone - 1) * 100) / 6)}%</p>
      <div className=" hidden bg-black p-2  md:col-span-2 md:flex md:h-3 md:w-full md:items-center md:rounded-full">
        <div
          className={`h-2 rounded-full bg-white ${
            width[team.presentMilestone - 2]
          }`}
        ></div>
      </div>
    </div>
  );
};
