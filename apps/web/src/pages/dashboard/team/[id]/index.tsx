import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { getQueryKey } from '@trpc/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { AiFillCopy, AiOutlineLeft } from 'react-icons/ai';
import { HiClipboardCheck } from 'react-icons/hi';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';

import { api } from '~/utils/api';
import { env } from '~/env.mjs';
import img1 from '~/images/wallpaper.jpg';
import PreLoader from '~/components/PreLoader';
import Stepper from '~/components/Stepper';
import Milestones from '~/components/Milestones';
import MentorMilestone from '~/components/MentorMilestone';
import Error from '~/components/Error';
import Button from '~/components/Button';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return {
    props: {
      data: session,
    },
  };
}

const Team = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  let toastid: string;
  const router = useRouter();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [files, setFiles] = useState<Array<string>>([]);
  const steps = [1, 2, 3, 4, 5, 6];

  const deleteTeam = api.team.deleteTeam.useMutation({
    onMutate: () => {
      toast.loading('Deleting team...', { id: toastid });
    },
    onSuccess: () => {
      const getTeamKey = getQueryKey(api.user.getOne);
      void queryClient.invalidateQueries({
        queryKey: [...getTeamKey],
      });
      toast.dismiss(toastid);
      toast.success('Deleted Team Successfully', { id: toastid });
      void router.push('/dashboard');
    },
    onError: (error) => {
      toast.dismiss(toastid);
      toast.error(`Error: ${error.message}`, { id: toastid });
    },
  });
  const leaveTeam = api.team.leaveTeam.useMutation({
    onMutate: () => {
      toast.loading('Leaving team...', { id: toastid });
    },
    onSuccess: () => {
      const getTeamKey = getQueryKey(api.user.getOne);
      void queryClient.invalidateQueries({
        queryKey: [...getTeamKey],
      });
      toast.dismiss(toastid);
      toast.success('Leaved Team Successfully', { id: toastid });
      void router.push('/dashboard');
    },
    onError: (error) => {
      toast.dismiss(toastid);
      toast.error(`Error: ${error.message}`, { id: toastid });
    },
  });
  const removeTeam = api.team.removeFromTeam.useMutation({
    onMutate: () => {
      toast.loading('Removing from team...', { id: toastid });
    },
    onSuccess: () => {
      const getTeamKey = getQueryKey(api.user.getOne);
      void queryClient.invalidateQueries({
        queryKey: [...getTeamKey],
      });
      toast.dismiss(toastid);
      toast.success('Member is removed from team', { id: toastid });
      void router.push('/dashboard/team');
    },
    onError: (error) => {
      toast.dismiss(toastid);
      toast.error(`Error: ${error.message}`, { id: toastid });
    },
  });
  const { data: userData, status: userStatus } = api.user.getOne.useQuery({
    id: data.user.id,
  });
  const { data: milestoneData, status: mileStoneStatus } =
    api.team.getMilestone.useQuery(undefined, {
      onSuccess: (data) => {
        setCurrentStep(data - 1);
      },
    });

  const { data: teamData, status: teamStatus } = api.team.getTeam.useQuery({
    id: String(router.query.id),
  });
  const paymentVerification = api.payment.verify.useMutation({
    onMutate: () => {
      toast.loading('Completing payment');
    },
    onSuccess: (data) => {
      console.log(data);
      toast.dismiss(toastid);
      const getTeamKey = getQueryKey(api.team.getTeam);
      void queryClient.invalidateQueries({
        queryKey: [...getTeamKey],
      });
      toast.success('Payment completed successfully');
      router.push({
        pathname: '/dashboard/team/thankyou',
        query: { teamId: teamData.id },
      });
    },
    onError: (error) => {
      console.log(error);
      toast.dismiss(toastid);
      toast.error(error.message);
    },
  });
  const paymentMutation = api.payment.pay.useMutation({
    onSuccess: (paymentData) => {
      console.log(paymentData);
      const options = {
        key_id: String(env.NEXT_PUBLIC_RAZORPAY_KEY_ID),
        amount: paymentData.amount,
        currency: paymentData.currency,
        order_id: paymentData.id,
        name: 'Studo Industry',
        handler: async (response) => {
          console.log(response);
          paymentVerification.mutateAsync({
            teamId: teamData.id,
            orderDetails: response,
          });
        },
        prefill: {
          name: data.user.name,
          email: data.user.email,
        },
      };
      const rzp1 = new (window as any).Razorpay(options);
      rzp1.on('payment.failed', function (response) {
        console.log(response);
        toast.error(response?.error?.description);
      });
      rzp1.open();
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message);
    },
  });

  const displayRazorPay = async () => {
    const res = await loadRazorPay();
    // console.log(res);
    if (!res) {
      alert('RazorPay failed to load, Please try again later.');
      return;
    }
    void paymentMutation.mutateAsync({
      projectId: teamData.project.id,
      teamId: teamData.id,
    });
  };
  const loadRazorPay = async () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  if (
    mileStoneStatus === 'loading' ||
    teamStatus === 'loading' ||
    userStatus === 'loading'
  )
    return <PreLoader />;

  // if (userData.team.map((team) => team.id))
  if (mileStoneStatus === 'error' || teamStatus === 'error')
    return <Error error='Error Loading data, Please try again in some time.' />;

  if (!teamData) return <Error error='Team doesnt exist' />;

  const leader = teamData.members.find(
    (member) => member.id === teamData?.leader,
  );
  const mentor = teamData.members.find(
    (member) => member.id === teamData?.mentor,
  );

  return (
    <>
      <div className='px-8 py-20 md:px-20'>
        <button
          onClick={() => router.back()}
          className='mb-10 flex items-center gap-2'
        >
          <AiOutlineLeft /> Go Back
        </button>
        <div className='flex flex-row items-center justify-between'>
          <h1 className='pb-10 text-2xl font-bold'>My Team</h1>
          {teamData.leader === data.user.id ? (
            <>
              <Link
                href='/dashboard/'
                className='rounded-2xl bg-red-500 p-3 font-semibold text-white shadow-xl transition-all hover:scale-110'
                onClick={() => {
                  void deleteTeam.mutateAsync({ teamId: teamData?.id });
                }}
              >
                Delete Team
              </Link>
            </>
          ) : (
            <>
              <Link
                href='/dashboard/'
                className='rounded-2xl bg-red-500 p-3 font-semibold text-white shadow-xl transition-all hover:scale-110'
                onClick={() => {
                  void leaveTeam.mutateAsync({ teamId: teamData?.id });
                }}
              >
                Leave Team
              </Link>
            </>
          )}
        </div>
        <div className='grid grid-cols-1 gap-28 rounded-xl bg-white px-4 py-10 shadow-xl md:grid-cols-3 md:px-20'>
          <div className='flex flex-col justify-between'>
            <div>
              <h3 className='font-bold'>Leader</h3>

              {leader && (
                <Link
                  className='m-2 flex items-center gap-4 rounded-md  p-2  hover:cursor-pointer hover:bg-gray-300'
                  href={`/dashboard/team/${teamData.id}/${leader.id}`}
                >
                  {leader?.image && (
                    <Image
                      height={40}
                      width={40}
                      src={leader?.image}
                      alt='image user'
                      className='rounded-full'
                    />
                  )}
                  <div>
                    <p className='font-bold'>{leader?.name}</p>
                    <p className='text-black/75'>
                      {leader?.email.slice(0, 24) + '...'}
                    </p>
                  </div>
                </Link>
              )}
            </div>
            <div>
              <h3 className='font-bold'>Mentor</h3>
              {mentor ? (
                <Link
                  className='m-2 flex items-center gap-4 rounded-md  p-2  hover:cursor-pointer hover:bg-gray-300'
                  href={`/dashboard/team/${teamData.id}/${mentor.id}`}
                >
                  {mentor?.image && (
                    <Image
                      height={40}
                      width={40}
                      src={mentor?.image}
                      alt='image user'
                      className='rounded-full'
                    />
                  )}
                  <div>
                    <p className='font-bold'>{mentor?.name}</p>
                    <p className='text-black/75'>
                      {mentor?.email.slice(0, 24) + '...'}
                    </p>
                  </div>
                  {teamData.leader === data.user.id && (
                    <button
                      className=' h-5 w-5 rounded-full bg-red-500 text-sm font-semibold text-white shadow-xl transition-all hover:scale-125'
                      onClick={() => {
                        void removeTeam.mutateAsync({
                          teamId: teamData.id,
                          userId: mentor.id,
                        });
                      }}
                    >
                      X
                    </button>
                  )}
                </Link>
              ) : (
                <p>Mentor doesnt exist</p>
              )}
            </div>
          </div>
          <div>
            <h3 className='font-bold'>Members</h3>
            <div>
              {teamData?.members.length != 0 ? (
                teamData?.members
                  .filter(
                    (member) =>
                      member.id !== leader?.id && member.id !== mentor?.id,
                  )
                  .map((member) => (
                    <div
                      key={member.id}
                      className=' flex flex-row items-center justify-between gap-10 rounded-md  p-2  hover:cursor-pointer hover:bg-gray-300'
                    >
                      <Link
                        className='m-2 flex items-center gap-4'
                        href={`/dashboard/team/${teamData.id}/${member.id}`}
                        key={member.id}
                      >
                        {member.image && (
                          <Image
                            height={40}
                            width={40}
                            src={member?.image}
                            alt='image user'
                            className='rounded-full'
                          />
                        )}
                        <div>
                          <p className='flex-wrap font-bold'>{member.name}</p>
                          <p className='flex-wrap text-black/75'>
                            {member.email.slice(0, 24) + '...'}
                          </p>
                        </div>
                      </Link>
                      {teamData.leader === data.user.id && (
                        <button
                          className=' h-5 w-5 rounded-full bg-red-500 text-sm font-semibold text-white shadow-xl transition-all hover:scale-125'
                          onClick={() => {
                            void removeTeam.mutateAsync({
                              teamId: teamData.id,
                              userId: member.id,
                            });
                          }}
                        >
                          X
                        </button>
                      )}
                    </div>
                  ))
              ) : (
                <p>No Members in the team yet</p>
              )}
            </div>
          </div>
          <div className='flex w-full flex-col items-center gap-4'>
            <div>
              <h3 className='font-bold'>Referral Code</h3>
              <div className='text-md flex items-center justify-between rounded-xl p-10 font-bold  shadow-xl md:text-2xl'>
                <p>{teamData?.referral_code}</p>
                {copied ? (
                  <HiClipboardCheck size={40} />
                ) : (
                  <AiFillCopy
                    size={40}
                    onClick={() => {
                      void navigator.clipboard.writeText(
                        String(teamData?.referral_code),
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
            <p className='font-bold'>or</p>
            <div className='text-md flex w-full items-center justify-center rounded-xl p-4 font-bold shadow-xl '>
              <p>Copy Link</p>
              {copiedLink ? (
                <HiClipboardCheck size={40} />
              ) : (
                <AiFillCopy
                  size={20}
                  onClick={() => {
                    void navigator.clipboard.writeText(
                      'https://studo-web.vercel.app/' +
                        'dashboard/team/join/' +
                        teamData?.referral_code,
                    );
                    setCopiedLink(true);
                    setTimeout(() => {
                      setCopiedLink(false);
                    }, 3000);
                  }}
                />
              )}
            </div>
          </div>
        </div>
        <h1 className='py-10 text-2xl font-bold'>My Project</h1>
        <Link
          href={`/dashboard/projects/${teamData.projectId}`}
          className='rounded-xl bg-white px-4 py-10 md:px-10 '
        >
          <div className='flex flex-col gap-8 pt-9  md:mx-20 md:flex-row'>
            <div
              className='flex flex-1 items-center justify-start rounded-lg bg-white p-4
                      text-center font-normal text-gray-600 shadow-xl'
            >
              <div className='max-w-lg rounded-lg bg-slate-400'>
                {teamData?.project?.images.length !== 0 ? (
                  <img
                    src={`${env.NEXT_PUBLIC_AWS_S3}${teamData.project.images[0]}`}
                    alt='project img'
                  />
                ) : (
                  <img src={img1.src} alt='replacement image' />
                )}
              </div>
            </div>
            <div
              className='flex-1 rounded-lg bg-white
                       px-10 pt-10 text-gray-600 shadow-xl'
            >
              <div className='mb-6 flex flex-wrap justify-between'>
                <h1 className=' text-2xl font-bold'>
                  {teamData?.project?.title}
                </h1>
              </div>
              <div className='mb-6'>
                <p>
                  Company-{' '}
                  <span className='font-bold'>
                    {teamData?.project?.company}
                  </span>
                </p>
              </div>
              <div className='mb-6'>
                <p>Categories-</p>
                <div className='my-4 flex flex-wrap gap-4'>
                  {teamData?.project?.categories.map((category, index) => (
                    <p key={index} className='rounded-full border-2 px-4 py-2'>
                      {category}
                    </p>
                  ))}
                </div>
              </div>
              <div className='mb-6'>
                <p>Tags-</p>
                <p className='flex flex-wrap gap-2 py-4 text-sm'>
                  {teamData?.project?.tags.map((tag, index) => (
                    <span key={index} className='  p-2 text-black/75 '>
                      #{tag}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>
          <div className='my-20 whitespace-pre-wrap px-10 text-gray-600'>
            {teamData.project.description && (
              <>
                <h2 className='pb-3 text-xl font-medium text-black'>
                  Description
                </h2>
                <p>{teamData.project.description}</p>
              </>
            )}
            {teamData.project.videoLink && (
              <>
                <h2 className='pb-3 text-xl font-medium text-black'>
                  Description
                </h2>
                <p>{teamData.project.videoLink}</p>
              </>
            )}
            {teamData.project.skills && (
              <>
                <h2 className='pb-3 pt-7 text-xl font-medium text-black'>
                  Skills
                </h2>
                <p>{teamData.project.skills}</p>
              </>
            )}
            {teamData.payment_status && teamData.project.features && (
              <>
                <h2 className='pb-3 pt-7 text-xl font-medium text-black'>
                  Features
                </h2>
                <p>{teamData.project.features}</p>
              </>
            )}
            {teamData.payment_status && teamData.project.implementation && (
              <>
                <h2 className='pb-3 pt-7 text-xl font-medium  text-black'>
                  Implementation
                </h2>
                <p>{teamData.project.implementation}</p>
              </>
            )}
            {teamData.payment_status && teamData.project.components && (
              <>
                <h2 className='pb-3 pt-7 text-xl font-medium  text-black'>
                  Components
                </h2>
                <p>{teamData.project.components}</p>
              </>
            )}
            {teamData.payment_status && teamData.project.specifications && (
              <>
                <h2 className='pb-3 pt-7 text-xl font-medium  text-black'>
                  Specifications
                </h2>
                <p>{teamData.project.specifications}</p>
              </>
            )}
            {teamData.payment_status && teamData.project.relatedInfo && (
              <>
                <h2 className='pb-3 pt-7 text-xl font-medium text-black'>
                  Other Related Information
                </h2>
                <p>{teamData.project.relatedInfo}</p>
              </>
            )}
          </div>
        </Link>
        <h1 className='py-10 text-2xl font-bold'>Milestones</h1>
        <div className='relative  rounded-xl bg-white px-10 py-10 shadow-xl '>
          {(teamData.members.length === 5 && teamData.mentor !== null) ||
          teamData.members.length === 6 ? (
            teamData.payment_status ? (
              <>
                <div className='flex w-full flex-col items-start justify-start py-8'>
                  {data.user.id === teamData.mentor ? (
                    <MentorMilestone
                      teamData={teamData}
                      // currentStep={currentStep}
                    />
                  ) : (
                    <>
                      <div className=' mt-8 flex w-full flex-col items-center justify-center gap-8'>
                        <Stepper
                          milestoneData={milestoneData}
                          steps={steps}
                          currentStep={currentStep}
                          setCurrentStep={setCurrentStep}
                        />
                        <div className='flex gap-12'>
                          <button
                            className=' mt-4 rounded px-4 py-2 font-bold text-black disabled:cursor-not-allowed  disabled:text-red-500'
                            onClick={() =>
                              setCurrentStep((prevStep) => prevStep - 1)
                            }
                            disabled={currentStep === 0}
                          >
                            Previous
                          </button>
                          <button
                            className=' mt-4 rounded px-4 py-2 font-bold text-black disabled:cursor-not-allowed  disabled:text-red-500'
                            onClick={() =>
                              setCurrentStep((prevStep) => prevStep + 1)
                            }
                            disabled={
                              currentStep === steps.length - 1 ||
                              currentStep === milestoneData - 1
                            }
                          >
                            Next
                          </button>
                        </div>
                      </div>
                      <Milestones
                        currentStep={currentStep}
                        milestoneData={milestoneData}
                        teamData={teamData}
                        files={files}
                        setFiles={setFiles}
                      />
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className='m-4 flex flex-col items-center justify-center gap-6'>
                <p>
                  Please complete your payment before submitting/approving
                  milestones.
                </p>
                <Button type='normal' onClick={() => displayRazorPay()}>
                  Pay with Razorpay
                </Button>
              </div>
            )
          ) : (
            <p>Please complete your team before submitting milestones.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Team;
