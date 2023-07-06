import { useRouter } from 'next/router';
import Image from 'next/image';
import React, { FormEvent, useState } from 'react';
import { toast } from 'react-hot-toast';

import LOGO from '~/images/studoindustry logo.png';
import { api } from '~/utils/api';

const UserInfo = () => {
  const router = useRouter();
  const branchs = [
    'Computer science engineering',
    'Information technology engineering',
    'Electrical engineering',
    'Electronics engineering',
    'Mechanical engineering',
    'Civil engineering',
    'Electrical vehicle (EV) engineering',
    'Electronic & communication engineering',
    'Biomedical engineering',
    'Agricultural engineering',
    'Mechatronics engineering',
    'Production engineering',
    'Textile engineering',
    'Automobile engineering',
    'Biochemical engineering',
    'Biotechnology engineering',
    'Cyber security engineering',
    'Instrumentation technology engineering',
  ];
  const info = api.user.userInfo.useMutation();
  const [firstName, setFirstName] = useState<string>('');
  const [middleName, setMiddleName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [college, setCollege] = useState<string>('');
  const [branch, setBranch] = useState<string>('');
  const year = [1, 2, 3, 4];
  const [selectYear, setYear] = useState<number>();
  const [contact, setContact] = useState<number>();
  const [showColleges, setShowColleges] = useState(false);
  const [showBranchs, setShowBranch] = useState(false);
  const [mentor, setMentor] = useState(false);

  const { data: colleges, status: collegeStatus } =
    api.college.getAll.useQuery();
  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      firstName !== '' &&
      middleName !== '' &&
      lastName !== '' &&
      college !== '' &&
      contact !== null
    ) {
      if (mentor && branch === '' && selectYear === null) {
        await info
          .mutateAsync({
            firstName,
            middleName,
            lastName,
            college,
            contact,
            mentor,
          })
          .then(() => {
            setFirstName('');
            setMiddleName('');
            setLastName('');
            setCollege('');
            setBranch('');
            setYear(null);
            setContact(null);
            toast.success('Information Recevied');
            router.push('/dashboard');
          });
      } else {
        await info
          .mutateAsync({
            firstName,
            middleName,
            lastName,
            college,
            contact,
            mentor,
            branch,
            year: selectYear,
          })
          .then(() => {
            setFirstName('');
            setMiddleName('');
            setLastName('');
            setCollege('');
            setBranch('');
            setYear(null);
            setContact(null);
            toast.success('Information Recevied');
            router.push('/dashboard');
          });
      }
    } else {
      toast.error('Please fill in the details properly.');
    }
  };

  return (
    <div className='z-100 absolute left-0 top-0 flex h-[100vh] w-full flex-col items-center justify-center bg-white md:px-96'>
      <Image src={LOGO} width={130} height={40} alt='LOGO' />
      <h1 className='from-orange to-blue my-6 bg-gradient-to-r bg-clip-text text-xl font-extrabold text-transparent'>
        We need some Information...
      </h1>
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
            <div className='scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-400 ml-5 h-64 overflow-y-scroll'>
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
        <div className='flex flex-col items-start gap-2 md:col-span-3'>
          <label htmlFor='mentor'>Are you joining as a mentor?</label>
          <input
            type='checkbox'
            name='mentor'
            id='mentor'
            className='h-10 w-10'
            checked={mentor}
            onChange={() => setMentor((prevValue) => !prevValue)}
          />
        </div>
        {!mentor && (
          <div className='grid grid-cols-1 gap-4 md:col-span-3 md:grid-cols-3'>
            <div className='flex flex-1 flex-col gap-2 md:col-span-3'>
              <input
                className='rounded-md border-2 border-gray-300 p-2'
                type='text'
                placeholder='Branch'
                value={branch}
                onClick={() =>
                  setShowBranch((previousValue) => {
                    return !previousValue;
                  })
                }
                onChange={(event) => {
                  setBranch(event.target.value);
                }}
              />
              {showBranchs && (
                <div className='scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-400 ml-5 h-64 overflow-y-scroll'>
                  {branchs.map((branch) => (
                    <p
                      className='m-2 w-96 rounded-md p-4 hover:cursor-pointer hover:bg-gray-300 '
                      key={branch}
                      onClick={() => {
                        setBranch(branch);
                        setShowBranch(false);
                      }}
                      placeholder='College'
                    >
                      {branch}
                    </p>
                  ))}
                </div>
              )}
            </div>
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
        )}
        <button className='hover:blue-orange-gradient rounded-md border-2 border-black bg-transparent p-2 font-semibold text-black shadow-xl transition-all hover:border-none hover:bg-gradient-to-bl hover:text-white md:col-span-3'>
          Submit
        </button>
      </form>
    </div>
  );
};

export default UserInfo;
