import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import { inferRouterOutputs } from '@trpc/server';
import { toast } from 'react-hot-toast';
import { MdOutlineDone } from 'react-icons/md';
import { RxCross1 } from 'react-icons/rx';
import { AppRouter } from 'server';
import { api } from '~/utils/api';
import Stepper from './Stepper';

type RouterOutput = inferRouterOutputs<AppRouter>;
type userDataType = RouterOutput['user']['getOne'];

const MentorMilestone = ({ userData }: { userData: userDataType }) => {
  let toastid: string;
  const [currentStep, setCurrentStep] = useState<number>(0);
  const steps = [1, 2, 3, 4, 5, 6];

  const queryClient = useQueryClient();

  const approveMilestone = api.team.milestoneApproval.useMutation({
    onMutate: () => {
      toast.loading('Submitting Milestone...', { id: toastid });
    },
    onSuccess: () => {
      const getTeamKey = getQueryKey(api.user.getOne);
      void queryClient.invalidateQueries({
        queryKey: [...getTeamKey],
      });
      toast.dismiss(toastid);
      toast.success('Approved Successfully', { id: toastid });
    },
    onError: (error) => {
      toast.dismiss(toastid);
      toast.error(`Error: ${error.message}`, { id: toastid });
    },
  });
  const rejectMilestone = api.team.milestoneRejection.useMutation({
    onMutate: () => {
      toast.loading('Submitting Milestone...', { id: toastid });
    },
    onSuccess: () => {
      const getTeamKey = getQueryKey(api.user.getOne);
      void queryClient.invalidateQueries({
        queryKey: [...getTeamKey],
      });
      toast.dismiss(toastid);
      toast.success('Rejected Successfully', { id: toastid });
    },
    onError: (error) => {
      toast.dismiss(toastid);
      toast.error(`Error: ${error.message}`, { id: toastid });
    },
  });

  useEffect(() => {
    setCurrentStep(userData.team.approvedMilestone);
  }, []);

  return (
    <div className='w-full'>
      <div className='flex w-full flex-col items-center justify-center'>
        <Stepper
          steps={steps}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          milestoneData={userData.team.approvedMilestone}
        />
        <div className='flex gap-12'>
          <button
            className=' mt-4 rounded px-4 py-2 font-bold text-black disabled:cursor-not-allowed disabled:text-red-500'
            onClick={() => setCurrentStep((prevStep) => prevStep - 1)}
            disabled={currentStep === 0}
          >
            Previous
          </button>
          <button
            className=' mt-4 rounded px-4 py-2 font-bold text-black disabled:cursor-not-allowed disabled:text-red-500'
            onClick={() => setCurrentStep((prevStep) => prevStep + 1)}
            disabled={
              currentStep === steps.length - 1 ||
              currentStep === userData.team.presentMilestone - 1
            }
          >
            Next
          </button>
        </div>
      </div>

      {currentStep + 1 === 1 && (
        <>
          {userData.team.approvedMilestone === 0 &&
            (userData.team.presentMilestone === 1 ? (
              <div className='my-10 flex w-full justify-center whitespace-pre-wrap'>
                <h3 className='text-lg font-bold'>
                  Students are yet to submit anything
                </h3>
              </div>
            ) : (
              <div className=' m-10 flex w-full  items-center justify-center gap-10'>
                <button
                  className='flex items-center justify-center gap-4 rounded-md bg-green-500 p-4 text-white'
                  onClick={() => {
                    approveMilestone.mutateAsync({
                      presentMilestone: userData.team.approvedMilestone + 1,
                      teamId: userData.teamId,
                    });
                  }}
                >
                  <MdOutlineDone size={40} /> Approve
                </button>
                <button
                  className='te xt-white flex items-center justify-center gap-4 rounded-md bg-red-500 p-4'
                  onClick={() => {
                    rejectMilestone.mutateAsync({
                      milestone: userData.team.presentMilestone - 1,
                      teamId: userData.teamId,
                    });
                  }}
                >
                  <RxCross1 size={40} /> Reject
                </button>
              </div>
            ))}
          {userData.team.approvedMilestone >= 1 && (
            <div>
              <p className='font-bold'>Uploaded Files:</p>
              {userData.team.milestone1.map((file, index) => (
                <div
                  key={index}
                  className='text-bold w-fit rounded-md p-8 shadow-xl'
                >
                  {file}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {currentStep + 1 === 2 && (
        <>
          {userData.team.approvedMilestone === 1 &&
            (userData.team.presentMilestone === 2 ? (
              <div className='my-10 flex w-full justify-center whitespace-pre-wrap'>
                <h3 className='text-lg font-bold'>
                  Students are yet to submit anything
                </h3>
              </div>
            ) : (
              <div className=' m-10 flex w-full  items-center justify-center gap-10'>
                <button
                  className='flex items-center justify-center  gap-4 rounded-md bg-green-500 p-4
                  text-white'
                  onClick={() => {
                    approveMilestone.mutateAsync({
                      presentMilestone: userData.team.approvedMilestone + 1,
                      teamId: userData.teamId,
                    });
                  }}
                >
                  <MdOutlineDone size={40} /> Approve
                </button>
                <button
                  className='flex items-center justify-center gap-4 rounded-md bg-red-500  p-4 text-white'
                  onClick={() => {
                    rejectMilestone.mutateAsync({
                      milestone: userData.team.presentMilestone - 1,
                      teamId: userData.teamId,
                    });
                  }}
                >
                  <RxCross1 size={40} /> Reject
                </button>
              </div>
            ))}
          {userData.team.approvedMilestone >= 2 && (
            <div>
              <p className='font-bold'>Uploaded Files:</p>
              {userData.team.milestone1.map((file, index) => (
                <div
                  key={index}
                  className='text-bold w-fit rounded-md p-8 shadow-xl'
                >
                  {file}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {currentStep + 1 === 3 && (
        <>
          {userData.team.approvedMilestone === 2 &&
            (userData.team.presentMilestone === 3 ? (
              <div className='my-10 flex w-full justify-center whitespace-pre-wrap'>
                <h3 className='text-lg font-bold'>
                  Students are yet to submit anything
                </h3>
              </div>
            ) : (
              <div className=' m-10 flex w-full  items-center justify-center gap-10'>
                <button
                  className='flex items-center justify-center  gap-4 rounded-md bg-green-500 p-4
                  text-white'
                  onClick={() => {
                    approveMilestone.mutateAsync({
                      presentMilestone: userData.team.approvedMilestone + 1,
                      teamId: userData.teamId,
                    });
                  }}
                >
                  <MdOutlineDone size={40} /> Approve
                </button>
                <button
                  className='flex items-center justify-center gap-4 rounded-md bg-red-500  p-4 text-white'
                  onClick={() => {
                    rejectMilestone.mutateAsync({
                      milestone: userData.team.presentMilestone - 1,
                      teamId: userData.teamId,
                    });
                  }}
                >
                  <RxCross1 size={40} /> Reject
                </button>
              </div>
            ))}
          {userData.team.approvedMilestone >= 3 && (
            <div>
              <p className='font-bold'>Uploaded Files:</p>
              {userData.team.milestone1.map((file, index) => (
                <div
                  key={index}
                  className='text-bold w-fit rounded-md p-8 shadow-xl'
                >
                  {file}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {currentStep + 1 === 4 && (
        <>
          {userData.team.approvedMilestone === 3 &&
            (userData.team.presentMilestone === 4 ? (
              <div className='my-10 flex w-full justify-center whitespace-pre-wrap'>
                <h3 className='text-lg font-bold'>
                  Students are yet to submit anything
                </h3>
              </div>
            ) : (
              <div className=' m-10 flex w-full  items-center justify-center gap-10'>
                <button
                  className='flex items-center justify-center  gap-4 rounded-md bg-green-500 p-4 text-white'
                  onClick={() => {
                    approveMilestone.mutateAsync({
                      presentMilestone: userData.team.approvedMilestone + 1,
                      teamId: userData.teamId,
                    });
                  }}
                >
                  <MdOutlineDone size={40} /> Approve
                </button>
                <button
                  className='flex items-center justify-center gap-4 rounded-md  bg-red-500 p-4 text-white'
                  onClick={() => {
                    rejectMilestone.mutateAsync({
                      milestone: userData.team.presentMilestone - 1,
                      teamId: userData.teamId,
                    });
                  }}
                >
                  <RxCross1 size={40} /> Reject
                </button>
              </div>
            ))}
          {userData.team.approvedMilestone >= 4 && (
            <div>
              <p className='font-bold'>Uploaded Files:</p>
              {userData.team.milestone1.map((file, index) => (
                <div
                  key={index}
                  className='text-bold w-fit rounded-md p-8 shadow-xl'
                >
                  {file}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {currentStep + 1 === 5 && (
        <>
          {userData.team.approvedMilestone === 4 &&
            (userData.team.presentMilestone === 5 ? (
              <div className='my-10 flex w-full justify-center whitespace-pre-wrap'>
                <h3 className='text-lg font-bold'>
                  Students are yet to submit anything
                </h3>
              </div>
            ) : (
              <div className=' m-10 flex w-full  items-center justify-center gap-10'>
                <button
                  className='flex items-center justify-center  gap-4 rounded-md bg-green-500 p-4 text-white'
                  onClick={() => {
                    approveMilestone.mutateAsync({
                      presentMilestone: userData.team.approvedMilestone + 1,
                      teamId: userData.teamId,
                    });
                  }}
                >
                  <MdOutlineDone size={40} /> Approve
                </button>
                <button
                  className='flex items-center justify-center gap-4 rounded-md  bg-red-500 p-4 text-white'
                  onClick={() => {
                    rejectMilestone.mutateAsync({
                      milestone: userData.team.presentMilestone - 1,
                      teamId: userData.teamId,
                    });
                  }}
                >
                  <RxCross1 size={40} /> Reject
                </button>
              </div>
            ))}
          {userData.team.approvedMilestone >= 5 && (
            <div>
              <p className='font-bold'>Uploaded Files:</p>
              {userData.team.milestone1.map((file, index) => (
                <div
                  key={index}
                  className='text-bold w-fit rounded-md p-8 shadow-xl'
                >
                  {file}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {currentStep + 1 === 6 && (
        <>
          {userData.team.approvedMilestone === 5 &&
            (userData.team.presentMilestone === 6 ? (
              <div className='my-10 flex w-full justify-center whitespace-pre-wrap'>
                <h3 className='text-lg font-bold'>
                  Students are yet to submit anything
                </h3>
              </div>
            ) : (
              <div className=' m-10 flex w-full  items-center justify-center gap-10'>
                <button
                  className='flex items-center justify-center  gap-4 rounded-md bg-green-500 p-4 text-white'
                  onClick={() => {
                    approveMilestone.mutateAsync({
                      presentMilestone: userData.team.approvedMilestone + 1,
                      teamId: userData.teamId,
                    });
                  }}
                >
                  <MdOutlineDone size={40} /> Approve
                </button>
                <button
                  className='flex items-center justify-center gap-4 rounded-md  bg-red-500 p-4 text-white'
                  onClick={() => {
                    rejectMilestone.mutateAsync({
                      milestone: userData.team.presentMilestone - 1,
                      teamId: userData.teamId,
                    });
                  }}
                >
                  <RxCross1 size={40} /> Reject
                </button>
              </div>
            ))}
          {userData.team.approvedMilestone >= 6 && (
            <div>
              <p className='font-bold'>Uploaded Files:</p>
              {userData.team.milestone1.map((file, index) => (
                <div
                  key={index}
                  className='text-bold w-fit rounded-md p-8 shadow-xl'
                >
                  {file}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MentorMilestone;
