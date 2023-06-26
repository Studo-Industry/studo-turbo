import React, { FormEvent, useState } from 'react'
import { toast } from 'react-hot-toast'
import { redirect } from "react-router-dom";
import { api } from '~/utils/api'


const UserInfo = () => {
  const branchs = [
    "Computer science engineering",
    "Information technology engineering",
    "Electrical engineering",
    "Electronics engineering",
    "Mechanical engineering",
    "Civil engineering",
    "Electrical vehicle (EV) engineering",
    "Electronic & communication engineering",
    "Biomedical engineering",
    "Agricultural engineering",
    "Mechatronics engineering",
    "Production engineering",
    "Textile engineering",
    "Automobile engineering",
    "Biochemical engineering",
    "Biotechnology engineering",
    "Cyber security engineering",
    "Instrumentation technology engineering",
  ];
  const info = api.user.userInfo.useMutation()
  const [firstName, setFirstName] = useState<string>("")
  const [middleName, setMiddleName] = useState<string>("")
  const [lastName, setLastName] = useState<string>("")
  const [college, setCollege] = useState<string>("")
  const [branch, setBranch] = useState<string>("")
  const year = [1, 2, 3, 4]
  const [selectYear, setYear] = useState<number>()
  const [contact, setContact] = useState<string>("")
  const [showColleges, setShowColleges] = useState(false);
  const [showBranchs, setShowBranch] = useState(false);

  const { data: colleges, status: collegeStatus } =
    api.college.getAll.useQuery();
  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (firstName !== "" && middleName !== "" && lastName !== "" && college !== "" && branch !== "" && selectYear !== null && contact !== "") {
      await info
        .mutateAsync({
          firstName,
          middleName,
          lastName,
          college,
          branch,
          year: selectYear,
          contact
        })
        .then(() => {
          setFirstName("")
          setMiddleName("")
          setLastName("")
          setCollege("")
          setBranch("")
          setYear(null)
          setContact(null)
          toast.success("Information Recevied")
          redirect("/dashboard")
        });
    } else {
      toast.error("Please fill in the details properly.");
    }
  };

  return (
    <div className='mx-96 my-20'>
      <h1 className='font-extrabold text-transparent text-xl bg-clip-text bg-gradient-to-r from-orange to-blue my-4'>We need some Information...</h1>
      <form
        onSubmit={(event) => void submitForm(event)}
        className='grid grid-cols-3 gap-5'>
        <input
          type="text"
          className='border-2 border-gray-300 rounded-md p-2 '
          placeholder='First Name'
          name='firstName'
          id='firstName'
          onChange={(event) => setFirstName(event.target.value)}
        />
        <input
          type="text"
          className='border-2 border-gray-300 rounded-md p-2 '
          placeholder='Middle Name'
          name='middleName'
          id='middleName'
          onChange={(event) => { setMiddleName(event.target.value) }}
        />
        <input
          type="text"
          className='border-2 border-gray-300 rounded-md p-2 '
          placeholder='Last Name'
          name='lastName'
          id='lastName'
          onChange={(event) => { setLastName(event.target.value) }}
        />
        <div className='flex flex-1 flex-col gap-2 col-span-3'>
          <input
            className='border-2 border-gray-300 rounded-md p-2'
            type='text'
            placeholder='College'
            value={college}
            onClick={() => setShowColleges((previousValue)=>{
              return !previousValue
            })}
            onChange={(event) => {
              setCollege(event.target.value);
            }}
          />
          {showColleges && <div className='scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-400 ml-5 h-64 overflow-y-scroll'>
            {collegeStatus === 'loading' && 'loading'}
            {collegeStatus === 'success' &&
              colleges
                .filter((data) =>
                  data.name.toLowerCase().includes(college.toLowerCase()),
                )
                .map((data) => (<p
                  className='m-2 w-96 rounded-md p-4 hover:cursor-pointer hover:bg-gray-300 '
                  key={data.code}
                  onClick={() => setCollege(data.name)}
                  placeholder='College'
                >
                  {data.name}
                </p>
                ))}
          </div>}
        </div>
        <div className='flex flex-1 flex-col gap-2 col-span-3'>
          <input
            className='border-2 border-gray-300 rounded-md p-2'
            type='text'
            placeholder='Branch'
            value={branch}
            onClick={() => setShowBranch((previousValue)=>{
              return !previousValue
            })}
            onChange={(event) => {
              setBranch(event.target.value);
            }}
          />
          {showBranchs && <div className='scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-400 ml-5 h-64 overflow-y-scroll'>
              {branchs
                .map((branch) => (<p
                  className='m-2 w-96 rounded-md p-4 hover:cursor-pointer hover:bg-gray-300 '
                  key={branch}
                  onClick={() => setBranch(branch)}
                  placeholder='College'
                >
                  {branch}
                </p>
                ))}
          </div>}
        </div>
        <select
          className="border-2 border-gray-300 rounded-md p-2  col-span-3"
          id="year"
          name="year"
          value={selectYear}
          placeholder='Year'
          onChange={(event) => {
            setYear(Number(event.target.value));
          }}
        >
          <option value="" disabled selected>Select your year</option>
          {year.map((year) => (
            <option key={year} value={year} className='m-2 rounded-md p-4 hover:cursor-pointer hover:bg-gray-300'>
              {year}
            </option>
          ))}
        </select>
        <input
          type="tel"
          className='border-2 border-gray-300 rounded-md p-2 col-span-3'
          placeholder='Contact'
          name='contact'
          id='contact'
          onChange={(event) => { setContact((event.target.value)) }}
        />
        <button className='bg-transparent rounded-md text-black col-span-3 p-2 border-2 border-black hover:bg-gradient-to-bl hover:blue-orange-gradient hover:text-white hover:border-none transition-all font-semibold shadow-xl'>Submit</button>
      </form>
    </div>
  )
}

export default UserInfo