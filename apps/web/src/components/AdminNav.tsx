import React from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { BiHomeSmile } from "react-icons/bi";
import { AiOutlineAppstoreAdd, AiOutlineFolderView } from "react-icons/ai";
import { RiTeamFill } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { GoSignOut } from "react-icons/go";
import {FaMoneyCheckAlt} from 'react-icons/fa'

import LOGO from "~/images/studoindustry logo.png";

const AdminNav = () => {
  return (
    <>
      <ul className="flex h-full w-full flex-col gap-6 px-4 py-16 text-lg">
        <li className="flex w-full items-center justify-center">
          <Image src={LOGO} width={130} height={40} alt="LOGO" />
        </li>
        <li className="flex flex-col gap-2">
          <Link
            href={"/admin/dashboard/"}
            className="flex items-center gap-8 rounded-md p-4 transition-all hover:scale-110 hover:shadow-xl "
          >
            <BiHomeSmile />
            Home
          </Link>
          <Link
            href={"/admin/dashboard/addprojects/"}
            className="flex items-center gap-8 rounded-md p-4 transition-all hover:scale-110 hover:shadow-xl"
          >
            <AiOutlineAppstoreAdd />
            Add Projects
          </Link>
          <Link
            href={"/admin/dashboard/viewprojects/"}
            className="flex items-center gap-8 rounded-md p-4 transition-all hover:scale-110 hover:shadow-xl"
          >
            <AiOutlineFolderView />
            View Projects
          </Link>
          <Link
            href={"/admin/dashboard/viewteams/"}
            className="flex items-center gap-8 rounded-md p-4 transition-all hover:scale-110 hover:shadow-xl"
          >
            <RiTeamFill />
            View Teams
          </Link>
          <Link
          href={"/admin/dashboard/approval/"}
          className="flex items-center gap-8 rounded-md p-4 transition-all hover:scale-110 hover:shadow-xl"
          >
            <FaMoneyCheckAlt/>
           Payment Approval
          </Link>
        </li>
        <li className="flex flex-col gap-2">
          <Link
            href={"/admin/dashboard/profile/"}
            className="flex items-center gap-8 rounded-md p-4 transition-all hover:scale-110 hover:shadow-xl"
          >
            <CgProfile />
            Profile
          </Link>
          <Link
            href={"/"}
            className="flex items-center gap-8 rounded-md p-4 transition-all hover:scale-110 hover:shadow-xl"
            onClick={() => void signOut()}
          >
            <GoSignOut />
            Sign Out
          </Link>
        </li>
      </ul>
    </>
  );
};

export default AdminNav;
