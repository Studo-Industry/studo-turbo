import Image from "next/image";
import Link from "next/link";
import { AiFillCopy, AiOutlineLeft } from "react-icons/ai";
import { HiClipboardCheck } from "react-icons/hi";
import { CgProfile } from "react-icons/cg";
import ImageCarousel from "~/components/ImageCarousel";
import img1 from "~/images/wallpaper.jpg";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { env } from "~/env.mjs";
import { useState, type ChangeEvent } from "react";
import { useRouter } from "next/router";
import { AppRouter } from "server";
import { inferRouterOutputs } from "@trpc/server";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";

const Team = () => {
  let toastid: string;
  const router = useRouter();
  const queryClient = useQueryClient();
  type RouterOutput = inferRouterOutputs<AppRouter>;
  type userDataType = RouterOutput["user"]["getOne"];
  const [copied, setCopied] = useState(false);
  const [files, setFiles] = useState<string[]>([]);
  const { data: sessionData, status: sessionStatus } = useSession();
  const mutate = api.user.pdfUpload.useMutation();
  const submitMilestone = api.team.mileStoneSubmit.useMutation({
    onMutate: () => {
      toast.loading("Submitting your files..", { id: toastid });
    },
    onSuccess: () => {
      const mileStoneSubmitKey = getQueryKey(api.team.mileStoneSubmit);
      const mileStoneDataKey = getQueryKey(api.team.getMilestone);
      console.log(mileStoneDataKey, mileStoneSubmitKey);
      queryClient.invalidateQueries({
        queryKey: [...mileStoneSubmitKey],
      });
      queryClient.invalidateQueries({
        queryKey: [...mileStoneDataKey],
      });
      setFiles([]);
      toast.dismiss(toastid);
      toast.success("Submitted your files successfully", { id: toastid });
    },
    onError: (error) => {
      toast.dismiss(toastid);
      toast.error(`Error: ${error}`, { id: toastid });
    },
  });

  const { data: milestoneData, status: mileStoneStatus } =
    api.team.getMilestone.useQuery(undefined, {
      onSuccess: (data) => {
        setCurrentStep(Number(data) - 1);
      },
    });
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [1, 2, 3, 4, 5, 6];

  const { data: userData, status: userStatus } = api.user.getOne.useQuery({
    id: sessionData?.user?.id!,
  });
  const uploadToS3 = async (file: File) => {
    toast.loading("Uploding File", { id: toastid });
    const formData = new FormData();

    formData.append("file", file);

    const fileType = file.type;
    const { uploadUrl, key } = await mutate.mutateAsync({
      extension: fileType,
    });

    const responseAWS = await fetch(uploadUrl, {
      body: file,
      method: "PUT",
    });

    if (responseAWS.ok === true) {
      toast.dismiss(toastid);
      toast.success("File Upload successfully", { id: toastid });
      setFiles((prevValue) => [...prevValue, `${key}`]);
      return;
    }
    toast.dismiss(toastid);
    toast.error("File Upload Failed", { id: toastid });
  };
  const AddFile = ({
    onFileSelect,
  }: {
    onFileSelect: (file: File) => void;
  }) => {
    const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        onFileSelect(file);
      }
    };
    return (
      <div className="flex flex-col">
        <label htmlFor="file">Upload File:</label>
        <input
          className="rounded-md p-2 text-black focus:outline-none "
          type="file"
          accept="application/pdf"
          name="file"
          onChange={handleFileSelect}
        />
      </div>
    );
  };

  const FileUpload = () => {
    return (
      <div className="mb-8 flex flex-col gap-4 ">
        <label> Files:</label>
        {files &&
          files?.map((file) => (
            <div
              key={file}
              className="flex items-center justify-between rounded-md bg-white  text-black"
            >
              <div className="rounded-md p-4 shadow-xl"> {file} Uploaded</div>
            </div>
          ))}
      </div>
    );
  };

  if (userStatus === "loading") return <h2>Loading...</h2>;
  if (milestoneData === undefined) return <h2>Error loading data...</h2>;
  if (userStatus === "error") return <h2>Error Loading data</h2>;
  if (!userData?.team) return <h2> Team doesnt exist</h2>;
  const leader = userData.team.members.find(
    (member) => member.id === userData.team?.leader
  );
  const mentor = userData.team.members.find(
    (member) => member.id === userData.team?.mentor
  );
  const Milestone = ({
    currentStep,
    milestoneData,
    userData,
  }: {
    currentStep: number;
    milestoneData: number;
    userData: userDataType;
  }) => {
    return (
      <>
        {currentStep + 1 === 1 && (
          <div className="whitespace-pre-wrap">
            <h3 className="text-lg font-bold">Stage (1): (PDF Format)</h3>
            <br />
            1) Upload Aim: The student uploads a document or statement that
            clearly defines the aim or objective of their project. This provides
            a clear understanding of what they intend to achieve through their
            work, setting the direction for the project.
            <br />
            2) Upload Description: The student uploads a detailed description of
            their project, outlining the scope, methodology, and expected
            outcomes. This document provides a comprehensive overview of the
            project, including its purpose, approach, and expected deliverables.
            <br />
            3) Upload Your Input in this Project: The student uploads a document
            or description highlighting their individual contribution to the
            project. This could include their research findings, innovative
            ideas, analysis, or any specific tasks they have undertaken. It
            demonstrates their unique input and contribution to the project.
            {currentStep + 1 < milestoneData ? (
              <>
                <div className="mt-4 flex flex-col gap-4">
                  <h4 className="text-bold">Uploaded Files</h4>
                  {userData?.team?.milestone1.map((file) => (
                    <div className="text-bold w-fit rounded-md p-8 shadow-xl">
                      {file}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="py-8">
                <AddFile onFileSelect={(file: File) => void uploadToS3(file)} />
                <FileUpload />
                <button
                  onClick={() => {
                    if (files.length !== 0) {
                      void submitMilestone.mutateAsync({
                        files: files,
                        milestone: currentStep + 1,
                      });
                    } else {
                      toast.error("Please upload required files");
                    }
                  }}
                  className="gradient-btn blue-orange-gradient hover:orange-white-gradient flex justify-center bg-gradient-to-bl text-base drop-shadow-lg hover:font-semibold hover:text-white"
                >
                  Submit
                </button>
              </div>
            )}
          </div>
        )}
        {currentStep + 1 === 2 && (
          <div className="whitespace-pre-wrap">
            <h3 className="text-lg font-bold">Stage (2): (PDF Format)</h3>
            <br />
            1) Upload Aim: The student uploads a document or statement that
            clearly defines the aim or objective of their project. This provides
            a clear understanding of what they intend to achieve through their
            work, setting the direction for the project.
            <br />
            2) Upload Description: The student uploads a detailed description of
            their project, outlining the scope, methodology, and expected
            outcomes. This document provides a comprehensive overview of the
            project, including its purpose, approach, and expected deliverables.
            <br />
            3) Upload Your Input in this Project: The student uploads a document
            or description highlighting their individual contribution to the
            project. This could include their research findings, innovative
            ideas, analysis, or any specific tasks they have undertaken. It
            demonstrates their unique input and contribution to the project.
            {currentStep + 1 < milestoneData ? (
              <>
                <div className="mt-4 flex flex-col gap-4">
                  <h4 className="text-bold">Uploaded Files</h4>
                  {userData?.team?.milestone2.map((file) => (
                    <div className="text-bold w-fit rounded-md p-8 shadow-xl">
                      {file}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="py-8">
                <AddFile onFileSelect={(file: File) => void uploadToS3(file)} />
                <FileUpload />
                <button
                  onClick={() => {
                    if (files.length !== 0) {
                      void submitMilestone.mutateAsync({
                        files: files,
                        milestone: currentStep + 1,
                      });
                    } else {
                      toast.error("Please upload required files");
                    }
                  }}
                  className="gradient-btn blue-orange-gradient hover:orange-white-gradient flex justify-center bg-gradient-to-bl text-base drop-shadow-lg hover:font-semibold hover:text-white"
                >
                  Submit
                </button>
              </div>
            )}
          </div>
        )}
        {currentStep + 1 === 3 && (
          <div className="whitespace-pre-wrap">
            <h3 className="text-lg font-bold">Stage (3): (PDF Format)</h3>
            <br />
            1) Upload Aim: The student uploads a document or statement that
            clearly defines the aim or objective of their project. This provides
            a clear understanding of what they intend to achieve through their
            work, setting the direction for the project.
            <br />
            2) Upload Description: The student uploads a detailed description of
            their project, outlining the scope, methodology, and expected
            outcomes. This document provides a comprehensive overview of the
            project, including its purpose, approach, and expected deliverables.
            <br />
            3) Upload Your Input in this Project: The student uploads a document
            or description highlighting their individual contribution to the
            project. This could include their research findings, innovative
            ideas, analysis, or any specific tasks they have undertaken. It
            demonstrates their unique input and contribution to the project.
            {currentStep + 1 < milestoneData ? (
              <>
                <div className="mt-4 flex flex-col gap-4">
                  <h4 className="text-bold">Uploaded Files</h4>
                  {userData?.team?.milestone3.map((file) => (
                    <div className="text-bold w-fit rounded-md p-8 shadow-xl">
                      {file}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="py-8">
                <AddFile onFileSelect={(file: File) => void uploadToS3(file)} />
                <FileUpload />
                <button
                  onClick={() => {
                    if (files.length !== 0) {
                      void submitMilestone.mutateAsync({
                        files: files,
                        milestone: currentStep + 1,
                      });
                    } else {
                      toast.error("Please upload required files");
                    }
                  }}
                  className="gradient-btn blue-orange-gradient hover:orange-white-gradient flex justify-center bg-gradient-to-bl text-base drop-shadow-lg hover:font-semibold hover:text-white"
                >
                  Submit
                </button>
              </div>
            )}
          </div>
        )}
        {currentStep + 1 === 4 && (
          <div className="whitespace-pre-wrap">
            <h3 className="text-lg font-bold">Stage (4): (PDF Format)</h3>
            <br />
            1) Upload Aim: The student uploads a document or statement that
            clearly defines the aim or objective of their project. This provides
            a clear understanding of what they intend to achieve through their
            work, setting the direction for the project.
            <br />
            2) Upload Description: The student uploads a detailed description of
            their project, outlining the scope, methodology, and expected
            outcomes. This document provides a comprehensive overview of the
            project, including its purpose, approach, and expected deliverables.
            <br />
            3) Upload Your Input in this Project: The student uploads a document
            or description highlighting their individual contribution to the
            project. This could include their research findings, innovative
            ideas, analysis, or any specific tasks they have undertaken. It
            demonstrates their unique input and contribution to the project.
            {currentStep + 1 < milestoneData ? (
              <>
                <div className="mt-4 flex flex-col gap-4">
                  <h4 className="text-bold">Uploaded Files</h4>
                  {userData?.team?.milestone4.map((file) => (
                    <div className="text-bold w-fit rounded-md p-8 shadow-xl">
                      {file}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="py-8">
                <AddFile onFileSelect={(file: File) => void uploadToS3(file)} />
                <FileUpload />
                <button
                  onClick={() => {
                    if (files.length !== 0) {
                      void submitMilestone.mutateAsync({
                        files: files,
                        milestone: currentStep + 1,
                      });
                    } else {
                      toast.error("Please upload required files");
                    }
                  }}
                  className="gradient-btn blue-orange-gradient hover:orange-white-gradient flex justify-center bg-gradient-to-bl text-base drop-shadow-lg hover:font-semibold hover:text-white"
                >
                  Submit
                </button>
              </div>
            )}
          </div>
        )}
        {currentStep + 1 === 5 && (
          <div className="whitespace-pre-wrap">
            <h3 className="text-lg font-bold">Stage (5): (PDF Format)</h3>
            <br />
            1) Upload Aim: The student uploads a document or statement that
            clearly defines the aim or objective of their project. This provides
            a clear understanding of what they intend to achieve through their
            work, setting the direction for the project.
            <br />
            2) Upload Description: The student uploads a detailed description of
            their project, outlining the scope, methodology, and expected
            outcomes. This document provides a comprehensive overview of the
            project, including its purpose, approach, and expected deliverables.
            <br />
            3) Upload Your Input in this Project: The student uploads a document
            or description highlighting their individual contribution to the
            project. This could include their research findings, innovative
            ideas, analysis, or any specific tasks they have undertaken. It
            demonstrates their unique input and contribution to the project.
            {currentStep + 1 < milestoneData ? (
              <>
                <div className="mt-4 flex flex-col gap-4">
                  <h4 className="text-bold">Uploaded Files</h4>
                  {userData?.team?.milestone5.map((file) => (
                    <div className="text-bold w-fit rounded-md p-8 shadow-xl">
                      {file}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="py-8">
                <AddFile onFileSelect={(file: File) => void uploadToS3(file)} />
                <FileUpload />
                <button
                  onClick={() => {
                    if (files.length !== 0) {
                      void submitMilestone.mutateAsync({
                        files: files,
                        milestone: currentStep + 1,
                      });
                    } else {
                      toast.error("Please upload required files");
                    }
                  }}
                  className="gradient-btn blue-orange-gradient hover:orange-white-gradient flex justify-center bg-gradient-to-bl text-base drop-shadow-lg hover:font-semibold hover:text-white"
                >
                  Submit
                </button>
              </div>
            )}
          </div>
        )}
        {currentStep + 1 === 6 && (
          <div className="whitespace-pre-wrap">
            <h3 className="text-lg font-bold">Stage (6): (PDF Format)</h3>
            <br />
            1) Upload Aim: The student uploads a document or statement that
            clearly defines the aim or objective of their project. This provides
            a clear understanding of what they intend to achieve through their
            work, setting the direction for the project.
            <br />
            2) Upload Description: The student uploads a detailed description of
            their project, outlining the scope, methodology, and expected
            outcomes. This document provides a comprehensive overview of the
            project, including its purpose, approach, and expected deliverables.
            <br />
            3) Upload Your Input in this Project: The student uploads a document
            or description highlighting their individual contribution to the
            project. This could include their research findings, innovative
            ideas, analysis, or any specific tasks they have undertaken. It
            demonstrates their unique input and contribution to the project.
            {currentStep + 1 < milestoneData ? (
              <>
                <div className="mt-4 flex flex-col gap-4">
                  <h4 className="text-bold">Uploaded Files</h4>
                  {userData?.team?.milestone6.map((file) => (
                    <div className="text-bold w-fit rounded-md p-8 shadow-xl">
                      {file}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="py-8">
                <AddFile onFileSelect={(file: File) => void uploadToS3(file)} />
                <FileUpload />
                <button
                  onClick={() => {
                    if (files.length !== 0) {
                      void submitMilestone.mutateAsync({
                        files: files,
                        milestone: currentStep + 1,
                      });
                    } else {
                      toast.error("Please upload required files");
                    }
                  }}
                  className="gradient-btn blue-orange-gradient hover:orange-white-gradient flex justify-center bg-gradient-to-bl text-base drop-shadow-lg hover:font-semibold hover:text-white"
                >
                  Submit
                </button>
              </div>
            )}
          </div>
        )}
      </>
    );
  };
  return (
    <div className="px-8 py-20 md:px-20">
      <h1 className="pb-10 text-2xl font-bold">My Team</h1>
      <div className="grid grid-cols-1 rounded-xl bg-white px-4 py-10 shadow-xl md:grid-cols-3 md:px-20">
        <div className="flex flex-col justify-between">
          <div>
            <h3 className="font-bold">Leader</h3>
            <Link
              className="m-2 flex items-center gap-4 rounded-md  p-2  hover:cursor-pointer hover:bg-gray-300"
              href="/dashboard/team/user/${userId}"
            >
              {leader?.image && (
                <Image
                  height={40}
                  width={40}
                  src={leader?.image}
                  alt="image user"
                  className="rounded-full"
                />
              )}
              <div>
                <p className="font-bold">{leader?.name}</p>
                <p className="text-black/75">{leader?.email}</p>
              </div>
            </Link>
          </div>
          <div>
            <h3 className="font-bold">Mentor</h3>
            {mentor ? (
              <Link
                className="m-2 flex items-center gap-4 rounded-md  p-2  hover:cursor-pointer hover:bg-gray-300"
                href="/dashboard/team/user/${userId}"
              >
                {mentor?.image && (
                  <Image
                    height={40}
                    width={40}
                    src={mentor?.image}
                    alt="image user"
                    className="rounded-full"
                  />
                )}
                <div>
                  <p className="font-bold">{mentor?.name}</p>
                  <p className="text-black/75">{mentor?.email}</p>
                </div>
              </Link>
            ) : (
              <p>Mentor doesnt exist</p>
            )}
          </div>
        </div>
        <div>
          <h3 className="font-bold">Members</h3>
          <div>
            {userData?.team?.members.length != 0 ? (
              userData?.team?.members
                .filter(
                  (member) =>
                    member.id !== leader?.id && member.id !== mentor?.id
                )
                .map((member) => (
                  <Link
                    className="m-2 flex items-center gap-4 rounded-md  p-2  hover:cursor-pointer hover:bg-gray-300"
                    href="/dashboard/team/user/${userId}"
                    key={member.id}
                  >
                    {member.image && (
                      <Image
                        height={40}
                        width={40}
                        src={member?.image}
                        alt="image user"
                        className="rounded-full"
                      />
                    )}
                    <div>
                      <p className="font-bold">{member.name}</p>
                      <p className="text-black/75">{member.email}</p>
                    </div>
                  </Link>
                ))
            ) : (
              <p>No Members in the team yet</p>
            )}
          </div>
        </div>
        <div>
          <h3 className="font-bold">Referral Code</h3>
          <div className="flex items-center justify-between rounded-xl p-10 text-2xl font-bold shadow-xl">
            <p>{userData?.team?.referral_code}</p>
            {copied ? (
              <HiClipboardCheck size={40} />
            ) : (
              <AiFillCopy
                size={40}
                onClick={() => {
                  void navigator.clipboard.writeText(
                    String(userData?.team?.referral_code)
                  );
                  setCopied(true);
                  setTimeout(() => {
                    setCopied(false);
                  }, 3000);
                }}
              />
            )}
          </div>
        </div>
      </div>
      <h1 className="py-10 text-2xl font-bold">My Project</h1>
      <div className="rounded-xl bg-white px-4 py-10  shadow-xl md:px-10 ">
        <div className="flex flex-col gap-8 pt-9  md:mx-20 md:flex-row">
          <div
            className="flex flex-1 items-center justify-start rounded-lg bg-white p-4
                    text-center font-normal text-gray-600 shadow-xl"
          >
            <div className="max-w-lg rounded-lg bg-slate-400">
              {userData?.team?.project?.images.length !== 0 ? (
                <ImageCarousel>
                  {userData?.team?.project?.images.map((s, i) => (
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
                     px-10 pt-10 text-gray-600 shadow-xl"
          >
            <div className="mb-6 flex flex-wrap justify-between">
              <h1 className=" text-2xl font-bold">
                {userData?.team?.project?.title}
              </h1>
              {/* {data?.paidProject && (
                    <div className="gradient-btn blue-orange-gradient hover:orange-white-gradient flex h-10 w-20  items-center justify-center bg-gradient-to-bl text-base drop-shadow-lg hover:font-semibold hover:text-white">
                      Paid
                    </div>
                  )} */}
            </div>
            <div className="mb-6">
              <p>
                Company-{" "}
                <span className="font-bold">
                  {userData?.team?.project?.company}
                </span>
              </p>
            </div>
            <div className="mb-6">
              <p>Categories-</p>
              <div className="my-4 flex flex-wrap gap-4">
                {userData?.team?.project?.categories.map((category, index) => (
                  <p key={index} className="rounded-full border-2 px-4 py-2">
                    {category}
                  </p>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <p>Tags-</p>
              <p className="flex gap-4 py-4 text-sm">
                {userData?.team?.project?.tags.map((tag, index) => (
                  <span key={index} className=" text-black/75">
                    {tag}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>
      </div>
      <h1 className="py-10 text-2xl font-bold">Milestones</h1>
      <div className="relative rounded-xl bg-white px-10 py-10 shadow-xl ">
        <div className=" mt-8 flex flex-col items-center gap-8">
          <Stepper
            milestoneData={Number(milestoneData)}
            steps={steps}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
          />
          <div className="flex gap-12">
            <button
              className=" mt-4 rounded px-4 py-2 font-bold text-black "
              onClick={() => setCurrentStep((prevStep) => prevStep - 1)}
              disabled={currentStep === 0}
            >
              Previous
            </button>
            <button
              className=" mt-4 rounded px-4 py-2 font-bold text-black"
              onClick={() => setCurrentStep((prevStep) => prevStep + 1)}
              disabled={
                currentStep === steps.length - 1 ||
                currentStep === Number(milestoneData) - 1
              }
            >
              Next
            </button>
          </div>
        </div>
        <div className="py-8">
          <Milestone
            currentStep={currentStep}
            milestoneData={milestoneData}
            userData={userData}
          />
        </div>
      </div>
    </div>
  );
};

const Stepper = ({
  steps,
  currentStep,
  setCurrentStep,
  milestoneData,
}: {
  milestoneData: number;
  steps: number[];
  currentStep: number;
  setCurrentStep: (value: number) => void;
}) => {
  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <div className="md:overflow-none grid grid-cols-2 gap-8 md:flex  ">
      {steps.map((step, index) => (
        <button
          onClick={() => handleStepChange(step - 1)}
          disabled={currentStep === Number(milestoneData) - 1}
          key={index}
          className={`flex h-20 w-20 items-center justify-center rounded-full border-4 hover:cursor-pointer ${
            index === currentStep
              ? " border-0 bg-black/75 font-bold text-white"
              : "text-gray-500"
          }`}
        >
          {step}
        </button>
      ))}
    </div>
  );
};

export default Team;
