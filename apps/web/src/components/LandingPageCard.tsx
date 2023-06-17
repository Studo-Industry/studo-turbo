import React from "react";

type props = {
  title: string;
  description: string;
};

const LandingPageCard = ({ title, description }: props) => {
  return (
    <div className="rounded-md p-4 text-center shadow-2xl">
      <h1 className="my-5 text-3xl font-semibold">{title}</h1>
      <div className="overflow-y-hidden">
        <p className="mb-12 text-sm ">{description}</p>
      </div>
      <button className="Button blue-orange-gradient gradient-btn bg-gradient-to-bl text-base">
        Submit
      </button>
    </div>
  );
};

export default LandingPageCard;
