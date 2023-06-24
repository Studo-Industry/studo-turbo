import React, { useState } from 'react';
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { FaSearch } from 'react-icons/fa';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

import { api } from '~/utils/api';
import PreLoader from '~/components/PreLoader';
import { ProjectCard } from '~/components/Cards';

const links = [
  { name: 'View Wishlist', link: '/dashboard/profile/wishlist' },
  { name: 'My Team', link: '/dashboard/team' },
  { name: 'Join Team', link: '/dashboard/team/join' },
  { name: 'My Profile', link: '/dashboard/profile' },
  { name: 'Yet To Fill', link: '/dashboard' },
];

const projectCategories = [
  { name: 'All Projects' },
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
const Dashboard = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [searchInput, setSearchInput] = useState('');
  const { data: userData, status: userStatus } = api.user.getOne.useQuery({
    id: data?.user?.id,
  });

  const router = useRouter();
  const { status: projectStatus, data: projects } =
    searchInput === ''
      ? Object.keys(router.query).length === 0
        ? api.project.getAll.useQuery()
        : api.project.getProjectByCategory.useQuery({
            category: String(router.query.category)!,
          })
      : api.project.getProjectBySearch.useQuery({ search: searchInput });

  if (data?.user.role === 'ADMIN') {
    void router.push('/admin/dashboard');
  }
  if (userData?.teamId) {
    void router.push('/dashboard/team/');
    return <></>;
  }
  if (userStatus === 'loading') {
    return <PreLoader />;
  }
  if (projectStatus === 'error') {
    return (
      <h1 className='p-20 text-2xl'>Error loading data , Please try again!</h1>
    );
  }
  return (
    <div className='my-20'>
      <div className='mx-6 my-16 md:mx-20'>
        <h1 className='font-inter text-2xl font-semibold'>
          Hi {data?.user.name},
        </h1>
        <div className='scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-400 mt-7 flex items-center gap-10 overflow-x-scroll whitespace-nowrap rounded-xl px-2 py-6 shadow-xl md:px-10 '>
          {links.map((link, index) => (
            <Link
              key={index}
              href={link.link}
              className='gradient-btn blue-orange-gradient text-sm'
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
      <div className='mx-6 my-20 rounded-lg pb-5 shadow-2xl md:mx-20'>
        <div className='flex flex-col justify-items-start gap-10 whitespace-nowrap px-8 py-8 md:flex-row md:gap-56 md:px-16'>
          <h1 className='mt-4 text-2xl font-bold'>View Projects</h1>
          <div className='flex w-full items-center justify-center rounded-full border-black px-4 shadow-xl md:gap-6 md:px-10'>
            <FaSearch className=' text-2xl' />
            <input
              type='search'
              placeholder='Search by title or company'
              className='my-2 w-11/12 px-2 py-2 outline-none md:px-6'
              id='searchInput'
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
        </div>
        <div className='flex justify-center gap-3 rounded-2xl px-5 shadow-xl md:mx-20'>
          <button className='mb-1 text-xl'>
            <IoIosArrowBack />
          </button>
          <div
            className='scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-400 my-5 flex gap-8 overflow-x-scroll whitespace-nowrap px-4 py-4'
            id='container'
          >
            {projectCategories.map((projectCategory, index) => (
              <Link
                href={{
                  pathname: '/dashboard',
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
          <div className='my-2 grid w-full grid-cols-1 gap-3 py-10 md:grid-cols-3'>
            {projectStatus === 'loading' ? (
              <div className='w-full md:col-span-3'>
                <PreLoader />
              </div>
            ) : (
              projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  id={project.id}
                  title={project.title}
                  images={project.images}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
