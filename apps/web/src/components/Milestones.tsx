import { Dispatch, SetStateAction, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { inferRouterOutputs } from '@trpc/server';
import { getQueryKey } from '@trpc/react-query';

import FileUpload, { AddFile } from '~/components/FileUpload';
import { AppRouter } from 'server';
import { api } from '~/utils/api';

type RouterOutput = inferRouterOutputs<AppRouter>;
type TeamDataType = RouterOutput['team']['getTeam'];

const Milestone = ({
  currentStep,
  milestoneData,
  teamData,
  setFiles,
  files,
}: {
  currentStep: number;
  milestoneData: number;
  teamData: TeamDataType;
  setFiles: Dispatch<SetStateAction<string[]>>;
  files: string[];
}) => {
  let toastid: string;
  const [link, setLink] = useState<string>('');
  const [linkCheck, setLinkCheck] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const mutate = api.user.pdfUpload.useMutation();
  const submitMilestone = api.team.mileStoneSubmit.useMutation({
    onMutate: () => {
      toast.loading('Submitting your files..', { id: toastid });
    },
    onSuccess: () => {
      const mileStoneSubmitKey = getQueryKey(api.team.mileStoneSubmit);
      const mileStoneDataKey = getQueryKey(api.team.getMilestone);
      setLink('');
      setLinkCheck(false);
      console.log(mileStoneDataKey, mileStoneSubmitKey);
      void queryClient.invalidateQueries({
        queryKey: [...mileStoneSubmitKey],
      });
      void queryClient.invalidateQueries({
        queryKey: [...mileStoneDataKey],
      });
      setFiles([]);
      toast.dismiss(toastid);
      toast.success('Submitted your files successfully', { id: toastid });
    },
    onError: (error) => {
      toast.dismiss(toastid);
      toast.error(`Error: ${error.message}`, { id: toastid });
    },
  });
  const uploadToS3 = async ({
    file,
    toastid,
    setFiles,
  }: {
    file: File;
    toastid: string;
    setFiles: Dispatch<SetStateAction<string[]>>;
  }) => {
    toast.loading('Uploding File', { id: toastid });
    const formData = new FormData();

    formData.append('file', file);

    const fileType = file.type;
    const { uploadUrl, key } = await mutate.mutateAsync({
      extension: fileType,
    });

    const responseAWS = await fetch(uploadUrl, {
      body: file,
      method: 'PUT',
    });

    if (responseAWS.ok === true) {
      toast.dismiss(toastid);
      toast.success('File Upload successfully', { id: toastid });
      setFiles((prevValue) => [...prevValue, `${key}`]);
      return;
    }
    toast.dismiss(toastid);
    toast.error('File Upload Failed', { id: toastid });
  };
  return (
    <>
      {currentStep + 1 === 1 && (
        <div className='whitespace-pre-wrap'>
          <h3 className='text-lg font-bold'>Stage (1): (PPT Formats)</h3>
          <br />
          <br />
          1) Upload Aim: The student uploads a document or statement that
          clearly defines the aim or objective of their project. This provides a
          clear understanding of what they intend to achieve through their work,
          setting the direction for the project.
          <br />
          <br />
          2) Upload Description: The student uploads a detailed description of
          their project, outlining the scope, methodology, and expected
          outcomes. This document provides a comprehensive overview of the
          project, including its purpose, approach, and expected deliverables.
          <br />
          <br />
          3) Upload Your Input in this Project: The student uploads a document
          or description highlighting their individual contribution to the
          project. This could include their research findings, innovative ideas,
          analysis, or any specific tasks they have undertaken. It demonstrates
          their unique input and contribution to the project.
          <>
            {currentStep + 1 < milestoneData ? (
              <>
                <div className='mt-4 flex flex-col gap-4'>
                  <h4 className='text-bold'>Uploaded Files</h4>
                  {teamData.milestone1.map((file, index) => (
                    <div
                      key={index}
                      className='text-bold w-fit rounded-md p-8 shadow-xl'
                    >
                      {file}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className='flex flex-col gap-6 py-8'>
                <div className='flex flex-col'>
                  <label htmlFor=''>
                    Check the below box to upload URL instead of files:
                  </label>
                  <input
                    type='checkbox'
                    name=''
                    id=''
                    checked={linkCheck}
                    onChange={(event) => setLinkCheck((value) => !value)}
                    className='h-10 w-10'
                  />
                </div>
                {linkCheck ? (
                  <div className='flex flex-row items-center gap-6'>
                    <label htmlFor=''>File URL:</label>
                    <input
                      type='url'
                      value={link}
                      onChange={(event) => setLink(event.target.value)}
                      className='flex-1 rounded-md border-2 p-2 valid:border-green-500 invalid:border-red-500 focus:outline-none'
                    />
                  </div>
                ) : (
                  <>
                    <AddFile
                      onFileSelect={(file: File) =>
                        void uploadToS3({
                          file: file,
                          setFiles: setFiles,
                          toastid: toastid,
                        })
                      }
                    />
                    <FileUpload files={files} />
                  </>
                )}
                <button
                  disabled={
                    !(
                      teamData.approvedMilestone + 1 ===
                      teamData.presentMilestone
                    )
                  }
                  onClick={() => {
                    if (linkCheck && link !== '') {
                      setFiles([link]);
                    }
                    if (files.length !== 0) {
                      void submitMilestone.mutateAsync({
                        files: files,
                        milestone: currentStep + 1,
                        typeofmilestone: linkCheck,
                      });
                    } else {
                      toast.error('Please upload required files');
                    }
                  }}
                  className=' gradient-btn blue-orange-gradient hover:orange-white-gradient flex justify-center bg-gradient-to-bl text-base drop-shadow-lg hover:font-semibold hover:text-white disabled:bg-red-500'
                >
                  Submit
                </button>
              </div>
            )}
          </>
        </div>
      )}
      {currentStep + 1 === 2 && (
        <div className='whitespace-pre-wrap'>
          <h3 className='text-lg font-bold'>
            Stage (2): (In Suitable Formats)
          </h3>
          <br />
          1) Mechanical Engineering: The student uploads CAD (Computer-Aided
          Design) files or AutoCAD designs related to the project. These could
          include 2D or 3D models, assembly drawings, or any other mechanical
          design documentation. These files showcase the mechanical aspects and
          design of the project.
          <br />
          <br />
          2) Electrical Engineering: The student uploads circuit diagrams, block
          diagrams, or any other electrical design documentation relevant to the
          project. This provides a visual representation of the electrical
          system or components involved, demonstrating their understanding of
          electrical engineering principles.
          <br />
          <br />
          3) Civil Engineering: The student uploads structural diagrams or
          drawings related to the project. This could include architectural
          plans, structural designs, or any other documentation that showcases
          the civil engineering aspects of the project, such as building layouts
          or structural calculations.
          <br />
          <br />
          4) IT and Electronics Communication Engineering: The student uploads
          relevant project materials such as software code, database designs,
          system architecture diagrams, or any other documentation related to
          the IT and communication aspects of the project. This demonstrates
          their expertise in software development, networking, or other
          IT-related fields.
          <br />
          <br />
          Note: For other engineering fields, students are required to upload
          project plans or diagrams specific to their field, highlighting the
          key aspects and methodologies relevant to their discipline.
          {currentStep + 1 < milestoneData ? (
            <>
              <div className='mt-4 flex flex-col gap-4'>
                <h4 className='text-bold'>Uploaded Files</h4>
                {teamData.milestone2.map((file, index) => (
                  <div
                    key={index}
                    className='text-bold w-fit rounded-md p-8 shadow-xl'
                  >
                    {file}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className='flex flex-col gap-6 py-8'>
              <div className='flex flex-col'>
                <label htmlFor=''>
                  Check the below box to upload URL instead of files:
                </label>
                <input
                  type='checkbox'
                  name=''
                  id=''
                  checked={linkCheck}
                  onChange={(event) => setLinkCheck((value) => !value)}
                  className='h-10 w-10'
                />
              </div>
              {linkCheck ? (
                <div className='flex flex-row items-center gap-6'>
                  <label htmlFor=''>File URL:</label>
                  <input
                    type='url'
                    value={link}
                    onChange={(event) => setLink(event.target.value)}
                    className='flex-1 rounded-md border-2 border-gray-500 p-2 valid:border-green-500 invalid:border-red-500 focus:outline-none'
                  />
                </div>
              ) : (
                <>
                  <AddFile
                    onFileSelect={(file: File) =>
                      void uploadToS3({
                        file: file,
                        setFiles: setFiles,
                        toastid: toastid,
                      })
                    }
                  />
                  <FileUpload files={files} />
                </>
              )}
              <button
                disabled={
                  !(
                    teamData.approvedMilestone + 1 ===
                    teamData.presentMilestone
                  )
                }
                onClick={() => {
                  if (linkCheck) {
                    if (link !== '') {
                      void submitMilestone.mutateAsync({
                        files: [link],
                        milestone: currentStep + 1,
                        typeofmilestone: linkCheck,
                      });
                    } else {
                      toast.error('Please upload required URL');
                    }
                  } else {
                    if (files.length !== 0) {
                      void submitMilestone.mutateAsync({
                        files: files,
                        milestone: currentStep + 1,
                        typeofmilestone: linkCheck,
                      });
                    } else {
                      toast.error('Please upload required files');
                    }
                  }
                }}
                className=' gradient-btn blue-orange-gradient hover:orange-white-gradient flex justify-center bg-gradient-to-bl text-base drop-shadow-lg hover:font-semibold hover:text-white disabled:bg-red-500'
              >
                Submit
              </button>
            </div>
          )}
        </div>
      )}
      {currentStep + 1 === 3 && (
        <div className='whitespace-pre-wrap'>
          <h3 className='text-lg font-bold'>Stage (3): (PDF Report Formats)</h3>
          <br />
          -Upload Semester Report: At the end of the semester, the student
          prepares and uploads a report summarizing the progress and outcomes
          achieved during that period. The report should include a detailed
          description of the work completed, challenges faced, results obtained,
          and any recommendations for further work. It serves as a comprehensive
          overview of the project&#39;s status and progress.
          <br />
          {currentStep + 1 < milestoneData ? (
            <>
              <div className='mt-4 flex flex-col gap-4'>
                <h4 className='text-bold'>Uploaded Files</h4>
                {teamData.milestone3.map((file, index) => (
                  <div
                    key={index}
                    className='text-bold w-fit rounded-md p-8 shadow-xl'
                  >
                    {file}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className='flex flex-col gap-6 py-8'>
              <div className='flex flex-col'>
                <label htmlFor=''>
                  Check the below box to upload URL instead of files:
                </label>
                <input
                  type='checkbox'
                  name=''
                  id=''
                  checked={linkCheck}
                  onChange={(event) => setLinkCheck((value) => !value)}
                  className='h-10 w-10'
                />
              </div>
              {linkCheck ? (
                <div className='flex flex-row items-center gap-6'>
                  <label htmlFor=''>File URL:</label>
                  <input
                    type='url'
                    value={link}
                    onChange={(event) => setLink(event.target.value)}
                    className='flex-1 rounded-md border-2 p-2 valid:border-green-500 invalid:border-red-500 focus:outline-none'
                  />
                </div>
              ) : (
                <>
                  <AddFile
                    onFileSelect={(file: File) =>
                      void uploadToS3({
                        file: file,
                        setFiles: setFiles,
                        toastid: toastid,
                      })
                    }
                  />
                  <FileUpload files={files} />
                </>
              )}
              <button
                disabled={
                  !(
                    teamData.approvedMilestone + 1 ===
                    teamData.presentMilestone
                  )
                }
                onClick={() => {
                  if (linkCheck) {
                    if (link !== '') {
                      void submitMilestone.mutateAsync({
                        files: [link],
                        milestone: currentStep + 1,
                        typeofmilestone: linkCheck,
                      });
                    } else {
                      toast.error('Please upload required URL');
                    }
                  } else {
                    if (files.length !== 0) {
                      void submitMilestone.mutateAsync({
                        files: files,
                        milestone: currentStep + 1,
                        typeofmilestone: linkCheck,
                      });
                    } else {
                      toast.error('Please upload required files');
                    }
                  }
                }}
                className=' gradient-btn blue-orange-gradient hover:orange-white-gradient flex justify-center bg-gradient-to-bl text-base drop-shadow-lg hover:font-semibold hover:text-white disabled:bg-red-500'
              >
                Submit
              </button>
            </div>
          )}
        </div>
      )}
      {currentStep + 1 === 4 && (
        <div className='whitespace-pre-wrap'>
          <h3 className='text-lg font-bold'>Stage (4): (.MP4 Video Formats)</h3>
          <br />
          -Upload a Short Video: The student and their team members create a
          short video (maximum 3 minutes) showcasing their project. The video
          should highlight the key features, functionality, and achievements of
          the project. It can include demonstrations, explanations, and
          interviews with team members to provide a comprehensive overview. The
          video helps in visually presenting the project&#39;s outcomes and
          engaging the audience.
          <br />
          {currentStep + 1 < milestoneData ? (
            <>
              <div className='mt-4 flex flex-col gap-4'>
                <h4 className='text-bold'>Uploaded Files</h4>
                {teamData.milestone4.map((file, index) => (
                  <div
                    key={index}
                    className='text-bold w-fit rounded-md p-8 shadow-xl'
                  >
                    {file}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className='flex flex-col gap-6 py-8'>
              <div className='flex flex-col'>
                <label htmlFor=''>
                  Check the below box to upload URL instead of files:
                </label>
                <input
                  type='checkbox'
                  name=''
                  id=''
                  checked={linkCheck}
                  onChange={(event) => setLinkCheck((value) => !value)}
                  className='h-10 w-10'
                />
              </div>
              {linkCheck ? (
                <div className='flex flex-row items-center gap-6'>
                  <label htmlFor=''>File URL:</label>
                  <input
                    type='url'
                    value={link}
                    onChange={(event) => setLink(event.target.value)}
                    className='flex-1 rounded-md border-2 p-2 valid:border-green-500 invalid:border-red-500 focus:outline-none'
                  />
                </div>
              ) : (
                <>
                  <AddFile
                    onFileSelect={(file: File) =>
                      void uploadToS3({
                        file: file,
                        setFiles: setFiles,
                        toastid: toastid,
                      })
                    }
                  />
                  <FileUpload files={files} />
                </>
              )}
              <button
                disabled={
                  !(
                    teamData.approvedMilestone + 1 ===
                    teamData.presentMilestone
                  )
                }
                onClick={() => {
                  if (linkCheck) {
                    if (link !== '') {
                      void submitMilestone.mutateAsync({
                        files: [link],
                        milestone: currentStep + 1,
                        typeofmilestone: linkCheck,
                      });
                    } else {
                      toast.error('Please upload required URL');
                    }
                  } else {
                    if (files.length !== 0) {
                      void submitMilestone.mutateAsync({
                        files: files,
                        milestone: currentStep + 1,
                        typeofmilestone: linkCheck,
                      });
                    } else {
                      toast.error('Please upload required files');
                    }
                  }
                }}
                className=' gradient-btn blue-orange-gradient hover:orange-white-gradient flex justify-center bg-gradient-to-bl text-base drop-shadow-lg hover:font-semibold hover:text-white disabled:bg-red-500'
              >
                Submit
              </button>
            </div>
          )}
        </div>
      )}
      {currentStep + 1 === 5 && (
        <div className='whitespace-pre-wrap'>
          <h3 className='text-lg font-bold'>Stage (5): (PDF Formats)</h3>
          <br />
          -Upload Final Report: As the project nears completion, the student
          prepares and uploads a comprehensive final report. This report should
          include all the details of the project, including the aim,
          description, methodology, results, analysis, conclusions, and future
          recommendations. It should serve as a complete record of the
          project&#39;s objectives, outcomes, and overall learning experience.
          <br />
          {currentStep + 1 < milestoneData ? (
            <>
              <div className='mt-4 flex flex-col gap-4'>
                <h4 className='text-bold'>Uploaded Files</h4>
                {teamData.milestone5.map((file, index) => (
                  <div
                    key={index}
                    className='text-bold w-fit rounded-md p-8 shadow-xl'
                  >
                    {file}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className='flex flex-col gap-6 py-8'>
              <div className='flex flex-col'>
                {!(
                  teamData.approvedMilestone + 1 ===
                  teamData.presentMilestone
                ) &&
                  currentStep + 1 === milestoneData && (
                    <p className='my-10 w-full text-center font-bold'>
                      Get your content{' '}
                      <span className='text-red-500'>approved</span> for the
                      previous milestone from mentor before submitting for the
                      below milestone.
                    </p>
                  )}
                <label htmlFor=''>
                  Check the below box to upload URL instead of files:
                </label>
                <input
                  type='checkbox'
                  name=''
                  id=''
                  checked={linkCheck}
                  onChange={(event) => setLinkCheck((value) => !value)}
                  className='h-10 w-10'
                />
              </div>
              {linkCheck ? (
                <div className='flex flex-row items-center gap-6'>
                  <label htmlFor=''>File URL:</label>
                  <input
                    type='url'
                    value={link}
                    onChange={(event) => setLink(event.target.value)}
                    className='flex-1 rounded-md border-2 p-2 valid:border-green-500 invalid:border-red-500 focus:outline-none'
                  />
                </div>
              ) : (
                <>
                  <AddFile
                    onFileSelect={(file: File) =>
                      void uploadToS3({
                        file: file,
                        setFiles: setFiles,
                        toastid: toastid,
                      })
                    }
                  />
                  <FileUpload files={files} />
                </>
              )}

              <button
                disabled={
                  !(
                    teamData.approvedMilestone + 1 ===
                    teamData.presentMilestone
                  )
                }
                onClick={() => {
                  if (linkCheck) {
                    if (link !== '') {
                      void submitMilestone.mutateAsync({
                        files: [link],
                        milestone: currentStep + 1,
                        typeofmilestone: linkCheck,
                      });
                    } else {
                      toast.error('Please upload required URL');
                    }
                  } else {
                    if (files.length !== 0) {
                      void submitMilestone.mutateAsync({
                        files: files,
                        milestone: currentStep + 1,
                        typeofmilestone: linkCheck,
                      });
                    } else {
                      toast.error('Please upload required files');
                    }
                  }
                }}
                className=' gradient-btn blue-orange-gradient hover:orange-white-gradient flex justify-center bg-gradient-to-bl text-base drop-shadow-lg hover:font-semibold hover:text-white disabled:bg-red-500'
              >
                Submit
              </button>
            </div>
          )}
        </div>
      )}
      {currentStep + 1 === 6 && (
        <div className='whitespace-pre-wrap'>
          <h3 className='text-lg font-bold'>Stage (6): (PDF Report Formats)</h3>
          <br />
          - Upload Industrial Certification: The student uploads the industrial
          certification or any relevant certification provided by the industry
          partner. This certificate serves as verification of their
          participation in an industrial setting and validates their experience
          and skills gained during the project. It adds credibility to the
          student&#39;s profile and showcases their industry-relevant expertise.
          <br />
          <br />
          Please note that the formats mentioned (PPT, PDF, .MP4) are suggested
          file formats for uploading the respective documents and videos.
          Students may need to follow specific guidelines or requirements
          provided by their institution or project mentor.
          <br />
          {currentStep + 1 < milestoneData ? (
            <>
              <div className='mt-4 flex flex-col gap-4'>
                <h4 className='text-bold'>Uploaded Files</h4>
                {teamData.milestone6.map((file, index) => (
                  <div
                    key={index}
                    className='text-bold w-fit rounded-md p-8 shadow-xl'
                  >
                    {file}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className='flex flex-col gap-6 py-8'>
              <div className='flex flex-col'>
                <label htmlFor=''>
                  Check the below box to upload URL instead of files:
                </label>
                <input
                  type='checkbox'
                  name=''
                  id=''
                  checked={linkCheck}
                  onChange={(event) => setLinkCheck((value) => !value)}
                  className='h-10 w-10'
                />
              </div>
              {linkCheck ? (
                <div className='flex flex-row items-center gap-6'>
                  <label htmlFor=''>File URL:</label>
                  <input
                    type='url'
                    value={link}
                    onChange={(event) => setLink(event.target.value)}
                    className='flex-1 rounded-md border-2 p-2 valid:border-green-500 invalid:border-red-500 focus:outline-none'
                  />
                </div>
              ) : (
                <>
                  <AddFile
                    onFileSelect={(file: File) =>
                      void uploadToS3({
                        file: file,
                        setFiles: setFiles,
                        toastid: toastid,
                      })
                    }
                  />
                  <FileUpload files={files} />
                </>
              )}
              <button
                disabled={
                  !(
                    teamData.approvedMilestone + 1 ===
                    teamData.presentMilestone
                  )
                }
                onClick={() => {
                  if (linkCheck) {
                    if (link !== '') {
                      void submitMilestone.mutateAsync({
                        files: [link],
                        milestone: currentStep + 1,
                        typeofmilestone: linkCheck,
                      });
                    } else {
                      toast.error('Please upload required URL');
                    }
                  } else {
                    if (files.length !== 0) {
                      void submitMilestone.mutateAsync({
                        files: files,
                        milestone: currentStep + 1,
                        typeofmilestone: linkCheck,
                      });
                    } else {
                      toast.error('Please upload required files');
                    }
                  }
                }}
                className=' gradient-btn blue-orange-gradient hover:orange-white-gradient flex justify-center bg-gradient-to-bl text-base drop-shadow-lg hover:font-semibold hover:text-white disabled:bg-red-500'
              >
                Submit
              </button>
            </div>
          )}
        </div>
      )}
      {currentStep + 1 > 6 && (
        <div className='flex w-full flex-row items-center justify-center py-20'>
          <h2 className='font-bold text-green-500'>
            All Milestones Have Been Submitted!
          </h2>
        </div>
      )}
    </>
  );
};

// const Milestones = ({children, currentStep, milestoneData, teamData, setFiles, files }: {
//   children: string | JSX.Element | JSX.Element[];
//   currentStep: number;
//   milestoneData: number;
//   teamData: TeamDataType;
//   setFiles: Dispatch<SetStateAction<string[]>>;
//   files: string[];
// }) => {
//   const queryClient = useQueryClient();
//   const submitMilestone = api.team.mileStoneSubmit.useMutation({
//     onMutate: () => {
//       toast.loading('Submitting your files..', { id: toastid });
//     },
//     onSuccess: () => {
//       const mileStoneSubmitKey = getQueryKey(api.team.mileStoneSubmit);
//       const mileStoneDataKey = getQueryKey(api.team.getMilestone);
//       console.log(mileStoneDataKey, mileStoneSubmitKey);
//       void queryClient.invalidateQueries({
//         queryKey: [...mileStoneSubmitKey],
//       });
//       void queryClient.invalidateQueries({
//         queryKey: [...mileStoneDataKey],
//       });
//       setFiles([]);
//       toast.dismiss(toastid);
//       toast.success('Submitted your files successfully', { id: toastid });
//     },
//     onError: (error) => {
//       toast.dismiss(toastid);
//       toast.error(`Error: ${error.message}`, { id: toastid });
//     },
//   });
//   const mutate = api.user.pdfUpload.useMutation();
//   let toastid: string;
//   const uploadToS3 = async ({
//     file,
//     toastid,
//     setFiles,
//   }: {
//     file: File;
//     toastid: string;
//     setFiles: Dispatch<SetStateAction<string[]>>;
//   }) => {
//     toast.loading('Uploding File', { id: toastid });
//     const formData = new FormData();

//     formData.append('file', file);

//     const fileType = file.type;
//     const { uploadUrl, key } = await mutate.mutateAsync({
//       extension: fileType,
//     });

//     const responseAWS = await fetch(uploadUrl, {
//       body: file,
//       method: 'PUT',
//     });

//     if (responseAWS.ok === true) {
//       toast.dismiss(toastid);
//       toast.success('File Upload successfully', { id: toastid });
//       setFiles((prevValue) => [...prevValue, `${key}`]);
//       return;
//     }
//     toast.dismiss(toastid);
//     toast.error('File Upload Failed', { id: toastid });
//   };
//   if(currentStep+1===1)
//   return (
//     <div>
//         <div className='whitespace-pre-wrap'>
//           <h3 className='text-lg font-bold'>Stage (1): (PPT Formats)</h3>
//           <br />
//           <br />
//           1) Upload Aim: The student uploads a document or statement that
//           clearly defines the aim or objective of their project. This provides a
//           clear understanding of what they intend to achieve through their work,
//           setting the direction for the project.
//           <br />
//           <br />
//           2) Upload Description: The student uploads a detailed description of
//           their project, outlining the scope, methodology, and expected
//           outcomes. This document provides a comprehensive overview of the
//           project, including its purpose, approach, and expected deliverables.
//           <br />
//           <br />
//           3) Upload Your Input in this Project: The student uploads a document
//           or description highlighting their individual contribution to the
//           project. This could include their research findings, innovative ideas,
//           analysis, or any specific tasks they have undertaken. It demonstrates
//           their unique input and contribution to the project.
//           <>
//             {currentStep + 1 < milestoneData ? (
//               <>
//                 <div className='mt-4 flex flex-col gap-4'>
//                   <h4 className='text-bold'>Uploaded Files</h4>
//                   {teamData.milestone1.map((file, index) => (
//                     <div
//                       key={index}
//                       className='text-bold w-fit rounded-md p-8 shadow-xl'
//                     >
//                       {file}
//                     </div>
//                   ))}
//                 </div>
//               </>
//             ) : (
//               <div className='py-8'>
//                 <AddFile
//                   onFileSelect={(file: File) =>
//                     void uploadToS3({
//                       file: file,
//                       setFiles: setFiles,
//                       toastid: toastid,
//                     })
//                   }
//                 />
//                 <FileUpload files={files} />
//                 <button
//                   disabled={
//                     !(
//                       teamData.approvedMilestone + 1 ===
//                       teamData.presentMilestone
//                     )
//                   }
//                   onClick={() => {
//                     if (files.length !== 0) {
//                       void submitMilestone.mutateAsync({
//                         files: files,
//                         milestone: currentStep + 1,
//                       });
//                     } else {
//                       toast.error('Please upload required files');
//                     }
//                   }}
//                   className=' gradient-btn blue-orange-gradient hover:orange-white-gradient flex justify-center bg-gradient-to-bl text-base drop-shadow-lg hover:font-semibold hover:text-white disabled:bg-red-500'
//                 >
//                   Submit
//                 </button>
//               </div>
//             )}
//           </>
//         </div>

//     </div>
//   )
// }

export default Milestone;
