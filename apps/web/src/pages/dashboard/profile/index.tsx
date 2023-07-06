import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Image from 'next/image';

import { api } from '~/utils/api';
import PreLoader from '~/components/PreLoader';
import { ProjectCard } from '~/components/Cards';
import Error from '~/components/Error';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);
  return {
    props: {
      data: session,
    },
  };
}

const Profile = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [isDisabled, setIsDisabled] = useState(true);
  const [firstName, setFirstName] = useState<string>('');
  const [middleName, setMiddleName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [college, setCollege] = useState<string>('');
  const options = [1, 2, 3, 4];
  const [year, setYear] = useState<number>();
  const [contact, setContact] = useState<number>();
  const [branch, setBranch] = useState<string>('');
  const { data: userData, status: userStatus } = api.user.getOne.useQuery({
    id: data?.user?.id,
  });

  if (userStatus === 'loading') return <PreLoader />;
  if (userStatus === 'error')
    return <Error error='Error Loading data, Please try again in some time.' />;

  if (userStatus === 'success' && userData) {
    setFirstName(userData?.firstName);
    setMiddleName(userData?.middleName);
    setLastName(userData?.lastName);
    setCollege(userData?.college);
    setYear(userData?.year);
    setContact(Number(userData?.contact));
    setBranch(userData?.branch);
  }

  return (
    <div className='relative my-10 flex flex-col items-center'>
      <div>
        <div className='flex flex-1 items-center justify-between py-4'>
          <h1 className='text-2xl'>My Profile</h1>
          <button
            className='rounded-md bg-red-500 px-4 py-2 font-bold text-white'
            onClick={() => {
              setIsDisabled((prevValue) => !prevValue);
              if (!isDisabled) {
              }
            }}
          >
            {isDisabled ? 'Edit' : 'Cancel'}
          </button>
        </div>
        <div className='mt-4 flex flex-col gap-24 md:flex-row'>
          <div className='flex flex-col items-center justify-center gap-5 '>
            {data?.user?.image && (
              <Image
                height={200}
                width={200}
                src={data?.user?.image}
                alt='image user'
                className='rounded-full selection:border-4 hover:border-4'
              />
            )}
            <div className='flex flex-col'>
              <h2 className=' text-2xl font-bold'>{data?.user.name}</h2>
              <h2 className=' text-sm font-bold'>{data?.user.email}</h2>
            </div>
          </div>
          <div className='hidden h-auto w-1 bg-black md:block'></div>
          <div className='m-10 grid grid-cols-1 gap-10 md:m-0 md:grid-cols-3'>
            <div className='flex flex-col gap-2'>
              <label htmlFor='firstName'>First Name</label>
              <input
                onChange={(event) => setFirstName(event.target.value)}
                type='text'
                className='rounded-md border-2 border-gray-300 p-2 disabled:cursor-not-allowed '
                value={firstName}
                disabled={isDisabled}
              />
            </div>
            <div className='flex flex-col gap-2'>
              <label htmlFor='middleName'>Middle Name</label>
              <input
                onChange={(event) => setMiddleName(event.target.value)}
                type='text'
                className='rounded-md border-2 border-gray-300 p-2 disabled:cursor-not-allowed '
                value={middleName}
                disabled={isDisabled}
              />
            </div>
            <div className='flex flex-col gap-2'>
              <label htmlFor='lastName'>Last Name</label>
              <input
                onChange={(event) => setLastName(event.target.value)}
                type='text'
                className='rounded-md border-2 border-gray-300 p-2 disabled:cursor-not-allowed '
                value={lastName}
                disabled={isDisabled}
              />
            </div>
            <div className='flex flex-col gap-2 md:col-span-3'>
              <label htmlFor='contact'>Contact Number</label>
              <input
                onChange={(event) => setContact(Number(event.target.value))}
                type='number'
                className='rounded-md border-2 border-gray-300 p-2 disabled:cursor-not-allowed '
                value={contact}
                disabled={isDisabled}
              />
            </div>
            <div className='flex flex-col gap-2 md:col-span-3'>
              <label htmlFor='college'>College</label>
              <input
                onChange={(event) => setCollege(event.target.value)}
                type='string'
                className='rounded-md border-2 border-gray-300 p-2 disabled:cursor-not-allowed '
                value={college}
                disabled={isDisabled}
              />
            </div>
            {userData.role !== 'MENTOR' ? (
              <>
                <div className='flex flex-col gap-2 md:col-span-2'>
                  <label htmlFor='branch'>Branch</label>
                  <input
                    onChange={(event) => setBranch(event.target.value)}
                    type='string'
                    className='rounded-md border-2 border-gray-300 p-2 disabled:cursor-not-allowed '
                    value={branch}
                    disabled={isDisabled}
                  />
                </div>
                <div className='flex flex-col gap-2 md:col-span-1'>
                  <label htmlFor='year'>Year</label>
                  <input
                    onChange={(event) => setYear(Number(event.target.value))}
                    type='number'
                    className='rounded-md border-2 border-gray-300 p-2 disabled:cursor-not-allowed '
                    value={year}
                    disabled={isDisabled}
                  />
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
        {!isDisabled && (
          <div className='my-10 flex w-full flex-1 items-center justify-center '>
            <button className='rounded-md bg-green-500 px-4 py-2 font-bold text-white'>
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
