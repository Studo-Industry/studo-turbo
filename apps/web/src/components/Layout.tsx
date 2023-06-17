import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const Layout = ({
  children,
}: {
  children: string | JSX.Element | JSX.Element[];
}) => {
  return (
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
