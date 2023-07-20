import React from "react";
import { Toaster } from "react-hot-toast";
import { Inter } from "next/font/google";
import { useSession } from "next-auth/react";

import Footer from "./Footer";
import Navbar from "./Navbar";
import AdminNav from "./AdminNav";
import PreLoader from "./PreLoader";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const Layout = ({
  children,
}: {
  children: string | JSX.Element | JSX.Element[];
}) => {
  const { data, status } = useSession();
  if (data?.user.role === "ADMIN") {
    return (
      <div className="grid h-screen grid-cols-8">
      <Toaster />
        <div className=" col-span-2 grid h-screen overflow-hidden rounded-md p-10 ">
          <AdminNav />
        </div>
        <div className="col-span-6 grid overflow-y-scroll scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-400">
          {children}
        </div>
      </div>
    );
  }
  return status === "loading" ? (
    <PreLoader />
  ) : (
    <div
      className={`flex min-h-screen min-w-full flex-col scroll-smooth ${inter.className}`}
    >
      <Toaster />
      <Navbar />
      <div className="z-0 min-w-full flex-1">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
