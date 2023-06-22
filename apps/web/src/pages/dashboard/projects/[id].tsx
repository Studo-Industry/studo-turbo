import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { AiOutlineLeft, AiFillHeart } from "react-icons/ai";
import { BsLightningFill } from "react-icons/bs";
import { GrClose } from "react-icons/gr";
import ImageCarousel from "~/components/ImageCarousel";
import { env } from "~/env.mjs";
import img1 from "~/images/wallpaper.jpg";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { Team } from "@prisma/client";

const Project = () => {
  let toastId: string;
  const session = useSession();
  const [modal, setModal] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user, status: userStatus } = api.user.getOne.useQuery({
    id: session.data?.user.id!,
  });
  const { data, status } = api.project.getOne.useQuery({
    id: String(router.query.id),
  });
  const mutate = api.user.addToWishlist.useMutation({
    onMutate: () => {
      toast.loading("Adding to wishlist..", { id: toastId });
    },
    onSuccess: () => {
      const userKey = getQueryKey(api.user.getOne);
      console.log(userKey);
      queryClient.invalidateQueries({ queryKey: [...userKey] });
      toast.dismiss(toastId);
      toast.success("Added To Wishlist succesfully!", { id: toastId });
    },
  });
  const deleteWishlist = api.user.deleteFromWishlist.useMutation({
    onMutate: () => {
      toast.loading("Deleting from wishlist..", { id: toastId });
    },
    onSuccess: () => {
      const userKey = getQueryKey(api.user.getOne);
      console.log(userKey);
      queryClient.invalidateQueries({ queryKey: [...userKey] });
      toast.dismiss(toastId);
      toast.success("Deleted from Wishlist succesfully!", { id: toastId });
    },
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
      {modal && (
        <div className="absolute left-0 top-0 z-40 flex h-screen w-screen items-center justify-center  bg-black/50">
          <Apply setModal={setModal} projectId={data.id} />
        </div>
      )}
      <div className="m-10 md:m-20">
        <div className="">
          <Link
            href="/dashboard"
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
              <div className="flex w-full flex-col gap-4 md:flex-row md:gap-10">
                <button
                  className="gradient-btn blue-orange-gradient hover:orange-white-gradient flex w-full justify-center bg-gradient-to-bl text-base drop-shadow-lg hover:font-semibold hover:text-white"
                  onClick={() => {
                    document.body.scrollTop = 0; // For Safari
                    document.documentElement.scrollTop = 0;
                    setModal(true);
                    document.body.style.overflow = "hidden";
                  }}
                >
                  <p className="mr-1 text-xl">
                    <BsLightningFill />
                  </p>
                  Apply
                </button>
                <button
                  className="gradient-btn blue-orange-gradient flex  w-full justify-center bg-gradient-to-bl text-base drop-shadow-lg hover:font-semibold hover:text-white "
                  onClick={() => {
                    user?.wishlist.find(
                      (project) => project?.id === data?.id
                    ) === undefined
                      ? void mutate.mutateAsync({ projectId: data?.id })
                      : void deleteWishlist.mutateAsync({
                          projectId: data?.id,
                        });
                  }}
                >
                  <p className="mr-1 text-xl">
                    <AiFillHeart />
                  </p>
                  {user?.wishlist.find(
                    (project) => project?.id === data?.id
                  ) === undefined
                    ? "Wishlist"
                    : "Remove"}
                </button>
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

const Apply = ({
  setModal,
  projectId,
}: {
  setModal: (value: boolean) => void;
  projectId: string;
}) => {
  const [createTeam, setCreateTeam] = useState(false);
  return (
    <div className="flex flex-col gap-10 rounded-md bg-white px-10 py-10">
      {createTeam ? (
        <>
          <CreateTeam setModal={setCreateTeam} projectId={projectId} />
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Apply For Project</h2>
            <GrClose
              className="hover:cursor-pointer"
              size={30}
              onClick={() => {
                setModal(false);
                document.body.style.overflow = "unset";
              }}
            />
          </div>
          <div className="flex flex-col gap-10 p-10">
            <button
              onClick={() => {
                setCreateTeam(true);
              }}
              className="Button gradient-btn blue-orange-gradient hover:orange-white-gradient  flex justify-center bg-gradient-to-bl text-base drop-shadow-lg hover:font-semibold hover:text-white"
            >
              <p className="mr-1 text-xl">
                <BsLightningFill />
              </p>
              Create Team
            </button>
            <Link
              href="/dashboard/team/join"
              className="Button gradient-btn blue-orange-gradient hover:orange-white-gradient  flex justify-center bg-gradient-to-bl text-base drop-shadow-lg hover:font-semibold hover:text-white"
            >
              <p className="mr-1 text-xl">
                <BsLightningFill />
              </p>
              Join Team
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

const CreateTeam = ({
  setModal,
  projectId,
}: {
  setModal: (value: boolean) => void;
  projectId: string;
}) => {
  let toastId: string;
  const [college, setCollege] = useState("");
  const [year, setYear] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const router = useRouter();
  const mutate = api.team.create.useMutation({
    onMutate: () => {
      toast.loading("Creating Team..", { id: toastId });
    },
    onSuccess: () => {
      toast.dismiss(toastId);
      toast.success("Team created successfully");
      void router.push("/dashboard/team");
    },
    onError: (error) => {
      toast.dismiss(toastId);
      toast.error(`Error creating team: ${error.message}`);
      // console.log(error);
    },
  });
  const { data: colleges, status: collegeStatus } =
    api.college.getAll.useQuery();
  return (
    <div className=" rounded-md bg-white px-10">
      <div className="flex justify-between">
        <h1 className="font-inter text-xl text-gray-600">Create Team</h1>
        <button
          className="text-2xl"
          onClick={() => {
            setModal(false);
            // document.body.style.overflow = "unset";
          }}
        >
          <GrClose />
        </button>
      </div>
      <div className="flex w-full flex-row justify-around gap-8 px-0 py-10  text-gray-600">
        <div className="flex flex-1 flex-col justify-start gap-2">
          <label className="text-sm font-semibold" htmlFor="">
            Year
          </label>
          <input
            className="border-grey-600 mx-0 rounded-full border-2 bg-white  p-3"
            type="number"
            placeholder="Year"
            value={year}
            onChange={(event) => setYear(Number(event.target.value))}
          />
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <label className="text-sm font-semibold" htmlFor="">
            College
          </label>
          <input
            className="border-grey-600 rounded-full border-2 bg-white p-3 "
            type="text"
            placeholder="College"
            value={college}
            onChange={(event) => {
              setCollege(event.target.value);
            }}
          />
          <div className="h-64 overflow-y-scroll scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-400">
            {collegeStatus === "loading" && "loading"}
            {collegeStatus === "success" &&
              colleges
                .filter((data) =>
                  data.name.toLowerCase().includes(college.toLowerCase())
                )
                .map((data) => (
                  <p
                    className="m-2 rounded-md p-4 hover:cursor-pointer hover:bg-gray-300 "
                    key={data.code}
                    onClick={() => setCollege(data.name)}
                  >
                    {data.name}
                  </p>
                ))}
          </div>
        </div>
      </div>

      <div className="w-full py-10 text-base text-gray-600">
        <p>Is your Mentor going to join the website ?</p>

        <input
          className="h-10 w-10 rounded-full border border-gray-600 py-2"
          type="checkbox"
        />
      </div>

      <div className="my-10 flex flex-row justify-start text-gray-600">
        <input
          onChange={() => {
            setAgreed((prevValue) => !prevValue);
          }}
          checked={agreed}
          className="py-auto mr-3 h-5 w-5"
          type="checkbox"
        />
        <p>
          I agree to the{" "}
          <span className="font-semibold">Terms & Conditions</span> and I
          understand that <span className="font-semibold">processing fees</span>{" "}
          is required to complete applying for the project.
        </p>
      </div>

      <button
        onClick={() => {
          if (agreed === true) {
            if (college.length === 0) {
              toast.error("Please fill in college");
            } else {
              void mutate.mutateAsync({ college, year, projectId });
            }
          } else {
            toast.error("Please check the terms and conditions box.");
          }
          document.body.style.overflow = "unset";
        }}
        className="Button gradient-btn blue-orange-gradient hover:orange-white-gradient  flex justify-center bg-gradient-to-bl text-base drop-shadow-lg hover:font-semibold hover:text-white"
      >
        <p className="mr-1 text-xl">
          <BsLightningFill />
        </p>
        Create Team
      </button>
    </div>
  );
};