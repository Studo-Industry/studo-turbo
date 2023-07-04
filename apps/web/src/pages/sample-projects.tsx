import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

import { api } from '~/utils/api';
import PreLoader from '~/components/PreLoader';
import { SampleProjectCard } from '~/components/Cards';
import Error from '~/components/Error';

const projectCategories = [
  { name: 'Computer science engineering' },
  { name: 'Information technology engineering' },
  { name: 'Electrical engineering' },
  { name: 'Electronics engineering' },
  { name: 'Mechanical engineering' },
  { name: 'Civil engineering' },
  { name: 'Electrical vehicle (EV) engineering' },
  { name: 'Electronic & communication engineering' },
  { name: 'Biomedical engineering' },
  { name: 'Agricultural engineering' },
  { name: 'Mechatronics engineering' },
  { name: 'Biochemical engineering' },
  { name: 'Production engineering' },
  { name: 'Textile engineering' },
  { name: 'Automobile engineering' },
  { name: 'Biotechnology engineering' },
  { name: 'Cyber security engineering' },
  { name: 'Instrumentation technology engineering' },
];

const SampleProjects = () => {
  const session = useSession();
  const router = useRouter();
  const { data: projectData, status: projectStatus } =
    api.project.getSample.useQuery({
      category: String(router.query.category),
    });

  if (session.status === 'authenticated') {
    void router.push('/dashboard');
  }

  if (projectStatus === 'error')
    return <Error error='Error Loading data, Please try again in some time.' />;
  return (
    <>
      <div className='my-10'>
        <h1 className='font-inter mb-20 text-center text-4xl font-bold'>
          Sample Projects
        </h1>
        <div className='flex justify-center gap-3 rounded-2xl px-5 shadow-xl md:mx-20'>
          <button className='mb-1 text-xl'>
            <IoIosArrowBack />
          </button>
          <div
            className='scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-400 my-5 flex gap-8 overflow-x-scroll whitespace-nowrap py-4'
            id='container'
          >
            {projectCategories.map((projectCategory, index) => (
              <Link
                href={{
                  pathname: '/sample-projects',
                  query: { category: projectCategory.name },
                }}
                key={index}
                className='Button gradient-btn blue-orange-gradient hover:orange-white-gradient  bg-gradient-to-bl px-8 py-4 text-xs drop-shadow-lg hover:font-semibold hover:text-white'
              >
                {projectCategory.name}
              </Link>
            ))}
          </div>
          <button className='mb-1 text-xl'>
            <IoIosArrowForward />
          </button>
        </div>
        <div className='mx-6 my-14 md:mx-20'>
          <h1 className='text-2xl font-semibold'>Projects</h1>
          <div className='my-2 grid grid-cols-1 gap-3 py-10 md:grid-cols-3'>
            {projectStatus === 'loading' ? (
              <div className='md:col-span-3'>
                <PreLoader />
              </div>
            ) : (
              projectData.map((project) => (
                <SampleProjectCard
                  id={project.id}
                  key={project.id}
                  title={project.title}
                  images={project.images}
                />
              ))
            )}
          </div>
        </div>
        <div className='mb-20 flex flex-col items-center gap-3'>
          <h2 className='text-lg'>Sign In For Full Access!</h2>
          <button
            className='Button blue-orange-gradient gradient-btn bg-gradient-to-bl text-lg'
            onClick={() => {
              void signIn();
            }}
          >
            Sign Up
          </button>
        </div>
      </div>
    </>
  );
};

export default SampleProjects;
