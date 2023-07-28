import { getSession } from 'next-auth/react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { AiFillEdit } from 'react-icons/ai';
import { GrClose } from 'react-icons/gr';
import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';

import { api } from '~/utils/api';
import PreLoader from '~/components/PreLoader';
import Error from '~/components/Error';
import Button from '~/components/Button';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);
  if (session) {
    return {
      props: {
        data: session,
      },
    };
  } else {
    return {
      props: {
        redirect: {
          destination: '/',
          permanent: false,
        },
      },
    };
  }
}

const Profile = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { data: userData, status: userStatus } = api.user.getOne.useQuery({
    id: data?.user?.id,
  });
  const [modal, setModal] = useState(false);

  if (userStatus === 'loading') return <PreLoader />;
  if (userStatus === 'error')
    return <Error error='Error Loading data, Please try again in some time.' />;

  return (
    <>
      {modal && (
        <div className='absolute left-0 top-0 z-40 flex h-screen w-screen items-center justify-center  bg-black/50'>
          <Edit setModal={setModal} />
        </div>
      )}
      <div className='mx-10 my-10 md:mx-20'>
      <title>User Profile</title>
        <div className='my-4 grid grid-cols-1 md:my-10 md:grid-cols-4'>
          <div className='flex flex-row items-center justify-center gap-4'>
            <div className='flex flex-col items-center justify-center gap-5'>
              <img
                src={userData.image}
                alt='profile picture'
                className='h-52 w-52 rounded-full'
              />
              <p>{userData.name}</p>
            </div>
            <div className='hidden h-full w-1 bg-gray-500 md:block' />
          </div>
          <div className='col-span-3 flex flex-col gap-6'>
            <Button
              type='normal'
              icon={<AiFillEdit size={24} />}
              onClick={() => 
                {setModal(true);
                  document.body.style.overflow = 'hidden';
                } }
            >
              Edit
            </Button>
            <div>
              <p className='font-bold'>Full Name:</p>
              <p>
                {userData.firstName +
                  ' ' +
                  userData.middleName +
                  ' ' +
                  userData.lastName}
              </p>
            </div>
            <div>
              <p className='font-bold'>Email Address:</p>
              <p>{userData.email}</p>
            </div>
            <div>
              <p className='font-bold'>Phone Number:</p>
              <p>{Number(userData.contact)}</p>
            </div>
            <div>
              <p className='font-bold'>College:</p>
              <p>{userData.college}</p>
            </div>
            <div>
              <p className='font-bold'>Branch:</p>
              <p>{userData.branch}</p>
            </div>
            <div>
              <p className='font-bold'>Year:</p>
              <p>{userData.year}</p>
            </div>
            <div className='flex gap-20'>
              <Button
                type='outline'
                onClick={() => router.push('/dashboard/team')}
              >
                View Team
              </Button>
              <Button
                type='outline'
                onClick={() => router.push('/dashboard/profile/wishlist')}
              >
                View Wishlist
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;

const Edit = ({ setModal }: { setModal: (value: boolean) => void }) => {
  let toastId: string;
  const router = useRouter();
  const queryClient = useQueryClient();
  const info = api.user.editingInfo.useMutation({
    onMutate: () => {
      toast.loading('Updating profile..', { id: toastId });
    },
    onSuccess: () => {
      toast.dismiss(toastId);
      toast.success('Profile updated successfully');
      void router.push('/dashboard/profile');
      setModal(false);
      const userKey = getQueryKey(api.user.getOne);
      void queryClient.invalidateQueries({ queryKey: [...userKey] });
    },
  });
  const { data: colleges, status: collegeStatus } =
  api.college.getAll.useQuery();
  const [firstName, setFirstName] = useState<string>('');
  const [middleName, setMiddleName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const year = [1, 2, 3, 4];
  const [selectYear, setYear] = useState<number>();
  const [contact, setContact] = useState<number>();
  const [college, setCollege] = useState<string>('');
  const [showColleges, setShowColleges] = useState(false);



  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      firstName !== '' &&
      middleName !== '' &&
      lastName !== '' &&
      contact !== null 
    ) {
      await info
        .mutateAsync({
          firstName,
          middleName,
          lastName,
          contact,
          year: selectYear,
          college
        })
        .then(() => {
          setFirstName('');
          setMiddleName('');
          setLastName('');
          setYear(null);
          setContact(null);
          setCollege('')
        });
    } else {
      toast.error('Please fill in the details properly.');
    }
  };
  return (
    <div className=' rounded-md bg-white p-24'>
      <div className='flex justify-between'>
        <h1 className='font-inter text-xl text-gray-600'>Edit Your Profile</h1>
        <button
          className='text-2xl'
          onClick={() => {
            setModal(false);
            document.body.style.overflow = 'scroll';
          }}
        >
          <GrClose />
        </button>
      </div>
      <div className='flex w-full flex-row justify-around gap-8 px-0 py-10  text-gray-600'>
        <div className='flex flex-1 flex-col justify-start gap-2'>
          <form
            onSubmit={(event) => void submitForm(event)}
            className='grid grid-cols-1 gap-4 md:grid-cols-3'
          >
            <input
              type='text'
              className='rounded-md border-2 border-gray-300 p-2 '
              placeholder='First Name'
              name='firstName'
              id='firstName'
              onChange={(event) => setFirstName(event.target.value)}
            />
            <input
              type='text'
              className='rounded-md border-2 border-gray-300 p-2 '
              placeholder='Middle Name'
              name='middleName'
              id='middleName'
              onChange={(event) => {
                setMiddleName(event.target.value);
              }}
            />
            <input
              type='text'
              className='rounded-md border-2 border-gray-300 p-2 '
              placeholder='Last Name'
              name='lastName'
              id='lastName'
              onChange={(event) => {
                setLastName(event.target.value);
              }}
            />
            <input
              type='tel'
              className='rounded-md border-2 border-gray-300 p-2 md:col-span-3'
              placeholder='Contact'
              name='contact'
              id='contact'
              onChange={(event) => {
                setContact(Number(event.target.value));
              }}
            />
            <div className='grid grid-cols-1 gap-4 md:col-span-3 md:grid-cols-3'>
              <select
                className='rounded-md border-2 border-gray-300 p-2  md:col-span-3'
                id='year'
                name='year'
                value={selectYear}
                placeholder='Year'
                onChange={(event) => {
                  setYear(Number(event.target.value));
                }}
              >
                <option value='' disabled selected>
                  Select your year
                </option>
                {year.map((year) => (
                  <option
                    key={year}
                    value={year}
                    className='m-2 rounded-md p-4 hover:cursor-pointer hover:bg-gray-300'
                  >
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className='flex flex-col gap-2 md:col-span-3 md:flex-1'>
          <input
            className='rounded-md border-2 border-gray-300 p-2'
            type='text'
            placeholder='College'
            value={college}
            onClick={() =>
              setShowColleges((previousValue) => {
                return !previousValue;
              })
            }
            onChange={(event) => {
              setCollege(event.target.value);
            }}
          />
          {showColleges && (
            <div className='scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-400 ml-5 h-52 overflow-y-scroll'>
              {collegeStatus === 'loading' && 'loading'}
              {collegeStatus === 'success' &&
                colleges
                  .filter((data) =>
                    data.name.toLowerCase().includes(college.toLowerCase()),
                  )
                  .map((data) => (
                    <p
                      className='m-2 w-96 rounded-md p-4 hover:cursor-pointer hover:bg-gray-300 '
                      key={data.code}
                      onClick={() => {
                        setCollege(data.name);
                        setShowColleges(false);
                      }}
                      placeholder='College'
                    >
                      {data.name}
                    </p>
                  ))}
            </div>
          )}
        </div>
            <div className='md:col-span-3'>
              <Button type='normal' onClick={() => submitForm}>
                Update
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
