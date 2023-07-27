import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Team } from '@prisma/client';
import { api } from '~/utils/api';
import { MdOutlineDone } from 'react-icons/md';
import { RxCross1 } from 'react-icons/rx';
import ImageCarousel from './ImageCarousel';
import { getQueryKey } from '@trpc/react-query';
import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

import { env } from '~/env.mjs';
import img1 from '~/images/wallpaper.jpg';
import team from '~/images/team.png';

export const LandingPageCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className='rounded-md p-4 text-center shadow-2xl'>
      <h1 className='my-5 text-3xl font-semibold'>{title}</h1>
      <div className='overflow-y-hidden'>
        <p className='mb-12 text-sm '>{description}</p>
      </div>
    </div>
  );
};

export const ProjectCard = ({
  id,
  images,
  title,
}: {
  id: string;
  title: string;
  images: string[];
}) => {
  return (
    <Link
      href={`/dashboard/projects/${id}`}
      className='project rounded-2xl shadow-2xl'
    >
      {images.length !== 0 ? (
        <img
          src={String(env.NEXT_PUBLIC_AWS_S3) + String(images[0])}
          alt={title}
          className='max-w-48 mx-auto  mb-5 mt-8 max-h-48 rounded-md'
        />
      ) : (
        <img
          className='max-w-48 mx-auto  mb-5 mt-8 max-h-48 rounded-md'
          src={img1.src}
        />
      )}
      <h1 className='mb-8 px-4 text-center text-sm font-bold'>{title}</h1>
    </Link>
  );
};

export const SampleProjectCard = ({
  id,
  images,
  title,
}: {
  id: string;
  title: string;
  images: string[];
}) => {
  return (
    <div className='project rounded-2xl shadow-2xl'>
      {images.length !== 0 ? (
        <img
          src={String(env.NEXT_PUBLIC_AWS_S3) + String(images[0])}
          alt={title}
          className='max-w-48 mx-auto  mb-5 mt-8 max-h-48 rounded-md'
        />
      ) : (
        <img
          className='max-w-48 mx-auto  mb-5 mt-8 max-h-48 rounded-md'
          src={img1.src}
        />
      )}
      <h1 className='mb-8 px-4 text-center text-sm font-bold'>{title}</h1>
    </div>
  );
};

export const TeamCard = ({ team, index }: { team: Team; index: number }) => {
  const width = [
    'w-[16.66%]',
    'w-[33.32%]',
    'w-[49.98%]',
    'w-[66.64]',
    'w-[83.33]',
    'w-full',
  ];
  return (
    <div className='grid grid-cols-3 items-center gap-4 rounded-md p-4 shadow-lg md:grid-cols-6'>
      <p>{index + 1}</p>
      <p className='md:col-span-2'>{team.college}</p>
      <p>{Math.round(((team.presentMilestone - 1) * 100) / 6)}%</p>
      <div className=' hidden bg-gray-300 p-2  md:col-span-2 md:flex md:h-3 md:w-full md:items-center md:rounded-full'>
        <div
          className={`blue-orange-gradient h-2 rounded-full bg-gradient-to-bl ${
            width[team.presentMilestone - 2]
          }`}
        ></div>
      </div>
    </div>
  );
};

export const AdminTeamCard = ({
  code,
  leader,
}: {
  code: string;
  leader: string;
}) => {
  const { data: leaderData, status: leaderStatus } = api.user.getOne.useQuery({
    id: leader,
  });
  return (
    <>
      <div className='flex flex-col items-center gap-8 rounded-bl-3xl rounded-tr-3xl border-2 border-gray-200 p-10 shadow-2xl md:flex-row'>
        <Image
          src={team}
          height={100}
          width={100}
          alt='teamPNG'
          className=' shadow-orange rounded-full p-2 shadow-inner'
        />
        {/* <div>
          <ul className="flex flex-col gap-3">
            <li>
              <h3 className="text-sm font-bold">Team Code:</h3> {code}
            </li>
            <li>
              <h3 className="text-sm font-bold">Leader Name:</h3>{" "}
              {leaderData?.name}
            </li>
            <li>
              <h3 className="text-sm font-bold">Project Name:</h3>{" "}
              {leaderData?.team?.project.title}
            </li>
            <li>
              <h3 className="text-sm font-bold">College Name:</h3>{" "}
              {leaderData?.team?.college}
            </li>
          </ul>
        </div> */}
      </div>
    </>
  );
};
