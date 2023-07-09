import React, { useState, useEffect } from 'react';
import { GetServerSidePropsContext, NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { getSession, signIn, signOut, useSession } from 'next-auth/react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';

import LOGO from '~/images/studoindustry logo.png';
import Button from './Button';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);
  if (session) {
    return {
      props: { session },
    };
  }
}
const Navbar: NextPage = () => {
  const [position1, setPosition1] = useState(false);
  const [position2, setPosition2] = useState(false);
  const [position3, setPosition3] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const { data, status } = useSession();

  useEffect(() => {
    // const closeDropdownsClick = (event) => {
    //   console.log(event);

    //   setPosition1(false);
    //   setPosition2(false);
    //   setPosition3(false);
    // };
    const closeDropdowns = (event) => {
      setPosition1(false);
      setPosition2(false);
      setPosition3(false);
    };
    window.addEventListener('scroll', closeDropdowns, { passive: true });
    // document.body.addEventListener('mousedown', closeDropdownsClick);

    return () => {
      window.removeEventListener('scroll', closeDropdowns);
      // document.body.removeEventListener('mousedown', closeDropdownsClick);
    };
  }, [position1, position2, position3]);

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

  return data?.user.role !== 'ADMIN' ? (
    <>
      <nav className=' flex items-center justify-between px-10 py-2 shadow-2xl md:px-20 md:py-4'>
        {/* <img src={require("../images/studoindustry logo.png")} alt="LOGO" /> */}
        <Link href={status === 'authenticated' ? '/dashboard' : '/'}>
          <Image src={LOGO} width={130} height={40} alt='LOGO' />
        </Link>
        <ul className='hidden items-center gap-20 font-semibold md:flex'>
          {status === 'authenticated' ? (
            <li
              className='flex items-center gap-2 rounded-md p-4 hover:cursor-pointer hover:bg-gray-300'
              onClick={() => {
                setPosition1((previousvalue) => {
                  setPosition2(false);
                  setPosition3(false);
                  return !previousvalue;
                });
              }}
            >
              View Project {position1 ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </li>
          ) : (
            <Link
              href='/sample-projects'
              className='flex items-center gap-2 rounded-md p-4 hover:cursor-pointer hover:bg-gray-300'
            >
              View Projects <IoIosArrowDown />
            </Link>
          )}
          <li
            className='flex items-center gap-2 rounded-md p-4 hover:cursor-pointer hover:bg-gray-300'
            onClick={() => {
              setPosition2((previousvalue) => {
                setPosition1(false);
                setPosition3(false);
                return !previousvalue;
              });
            }}
          >
            Learn{position2 ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </li>
          <Link
            className='flex items-center gap-2 scroll-smooth rounded-md p-4 hover:cursor-pointer hover:bg-gray-300'
            href='#footer'
          >
            Contact
          </Link>
          {status === 'authenticated' ? (
            data?.user?.image && (
              <Image
                height={40}
                width={40}
                src={data?.user?.image}
                alt='image user'
                className='rounded-full selection:border-4 hover:border-4'
                onClick={() => {
                  setPosition3((previousvalue) => {
                    setPosition2(false);
                    setPosition1(false);
                    return !previousvalue;
                  });
                }}
              />
            )
          ) : (
            <Button
              type='outline'
              onClick={() => {
                void signIn();
              }}
            >
              Sign In
            </Button>
          )}

          {/* <button><img src={require("../images/SignIn Button.png")}  alt="LOGO" /></button> */}
        </ul>
        <button
          className='block md:hidden'
          onClick={() => {
            openMenu
              ? (document.body.style.overflow = 'unset')
              : (document.body.style.overflow = 'hidden');
            document.body.scrollTop = 0;
            setOpenMenu((previousValue) => !previousValue);
          }}
        >
          {openMenu ? (
            <AiOutlineClose size={30} />
          ) : (
            <AiOutlineMenu size={30} />
          )}
        </button>
        {openMenu && (
          <div className=' absolute left-0 top-20 z-10 h-full w-full bg-white p-10'>
            <div className='flex h-5/6 flex-col justify-between'>
              <ul>
                <li
                  onClick={() => {
                    setOpenMenu(false);
                    document.body.style.overflow = 'unset';
                  }}
                  className='flex items-center gap-2 rounded-md p-4 hover:cursor-pointer hover:bg-gray-300'
                >
                  <Link
                    className='w-full'
                    href={
                      status === 'authenticated'
                        ? '/dashboard'
                        : '/sample-projects'
                    }
                  >
                    View Projects
                  </Link>
                </li>

                {status === 'authenticated' && (
                  <li
                    onClick={() => {
                      setOpenMenu(false);
                      document.body.style.overflow = 'unset';
                    }}
                    className='flex items-center gap-2 rounded-md p-4 hover:cursor-pointer hover:bg-gray-300'
                  >
                    <Link className='w-full' href='/dashboard/team'>
                      My Team
                    </Link>
                  </li>
                )}
                <li
                  onClick={() => {
                    setOpenMenu(false);
                    document.body.style.overflow = 'unset';
                  }}
                  className='flex items-center gap-2 rounded-md p-4 hover:cursor-pointer hover:bg-gray-300'
                >
                  Learn
                </li>
                <li
                  onClick={() => {
                    setOpenMenu(false);
                    document.body.style.overflow = 'unset';
                  }}
                  className='flex items-center gap-2 rounded-md p-4 hover:cursor-pointer hover:bg-gray-300'
                >
                  <Link className='w-full' href='#footer'>
                    Contact
                  </Link>
                </li>
              </ul>
              {status === 'unauthenticated' && (
                <li
                  onClick={() => {
                    setOpenMenu(false);
                    document.body.style.overflow = 'unset';
                    void signIn();
                  }}
                  className='flex items-center justify-center gap-2  rounded-full bg-gray-300 p-4  font-bold  hover:cursor-pointer hover:border-2 hover:border-gray-300 hover:bg-transparent'
                >
                  Sign In
                </li>
              )}
              {status === 'authenticated' && (
                <div className='flex flex-col gap-4'>
                  <Link
                    className='m-2 flex gap-4 rounded-md border-b-2 border-gray-300 p-2 hover:cursor-pointer hover:bg-gray-300'
                    href='/dashboard/profile'
                    onClick={() => {
                      setOpenMenu(false);
                      document.body.style.overflow = 'unset';
                    }}
                  >
                    {data?.user?.image && (
                      <Image
                        height={40}
                        width={40}
                        src={data?.user?.image}
                        alt='image user'
                        className='rounded-full'
                      />
                    )}
                    <div>
                      <p className='font-bold'>{data?.user.name}</p>
                      <p className='text-black/75'>{data?.user.email}</p>
                    </div>
                  </Link>
                  <div
                    className='m-2 flex items-center justify-center  gap-4 rounded-full bg-red-500 px-8 py-4 font-bold  text-white hover:cursor-pointer hover:bg-red-600'
                    onClick={() => void signOut()}
                  >
                    Logout
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
      <div
        className={`${
          position1 ? 'absolute' : 'hidden'
        } right-10 top-24 z-10  list-none  rounded-md bg-white p-10 shadow-2xl`}
      >
        <p className='font-bold'>Categories</p>

        <div className='mt-10 grid grid-cols-3 whitespace-nowrap'>
          {projectCategories.map((project, index) => (
            <Link
              href={{
                pathname: '/dashboard',
                query: { category: project.name },
              }}
              className='m-2 rounded-md p-4 hover:cursor-pointer hover:bg-gray-300'
              key={index}
              onClick={() => {
                setPosition1(false);
                setPosition2(false);
                setPosition3(false);
              }}
            >
              {project.name}
            </Link>
          ))}
        </div>
      </div>
      <div
        className={`${
          position2 ? 'absolute' : 'hidden'
        } right-1/4 top-24 z-10 rounded-md bg-white p-10 shadow-2xl`}
      >
        <p className='font-bold'>Learn With Us</p>
      </div>
      <div
        className={`${
          position3 ? 'absolute' : 'hidden'
        } right-4 top-24 z-10 rounded-md bg-white p-10 shadow-2xl`}
      >
        <Link
          className='m-2 flex items-center  gap-4 rounded-md border-b-2 p-2  hover:cursor-pointer hover:bg-gray-300'
          href='/dashboard/profile'
          onClick={() => {
            setPosition3((previousvalue) => {
              setPosition2(false);
              setPosition1(false);
              return !previousvalue;
            });
          }}
        >
          {data?.user?.image && (
            <Image
              height={40}
              width={40}
              src={data?.user?.image}
              alt='image user'
              className='rounded-full'
            />
          )}
          <div>
            <p className='font-bold'>{data?.user.name}</p>
            <p className='text-black/75'>{data?.user.email}</p>
          </div>
        </Link>
        <div className='border-b-2 py-4'>
          <Link
            href='/dashboard/team'
            onClick={() => {
              setPosition3((previousvalue) => {
                setPosition2(false);
                setPosition1(false);
                return !previousvalue;
              });
            }}
            className='my-2 block rounded-md p-4 hover:cursor-pointer hover:bg-gray-300'
          >
            My Team
          </Link>
          <Link
            onClick={() => {
              setPosition3((previousvalue) => {
                setPosition2(false);
                setPosition1(false);
                return !previousvalue;
              });
            }}
            href='/dashboard/profile/wishlist'
            className='my-2 block rounded-md p-4 hover:cursor-pointer hover:bg-gray-300'
          >
            Wishlist
          </Link>
          <p
            onClick={() => {
              setPosition3((previousvalue) => {
                setPosition2(false);
                setPosition1(false);
                return !previousvalue;
              });
            }}
            className='my-2 block rounded-md p-4 hover:cursor-pointer hover:bg-gray-300'
          >
            Help Me
          </p>
        </div>
        <div
          onClick={() => {
            setPosition3((previousvalue) => {
              setPosition2(false);
              setPosition1(false);
              return !previousvalue;
            });
          }}
          className='pt-4'
        >
          <p
            className='my-2 block rounded-md p-4 hover:cursor-pointer hover:bg-gray-300'
            onClick={() => {
              void signOut({
                callbackUrl: '/',
              });
            }}
          >
            Sign Out
          </p>
        </div>
      </div>
    </>
  ) : (
    <></>
  );
};

export default Navbar;
