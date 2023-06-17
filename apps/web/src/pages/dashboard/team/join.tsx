import { useRouter } from "next/router";
import React, { useState } from "react";
import { BsLightningFill } from "react-icons/bs";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";

const Join = () => {
  let toastid: string;
  const [referral, setReferral] = useState("");
  const [role, setRole] = useState("member");
  const router = useRouter();
  const mutate = api.team.join.useMutation({
    onMutate: () => {
      toast.loading("Joining team..", { id: toastid });
    },
    onSuccess: () => {
      toast.dismiss(toastid);
      toast.success("Joined team successfully", { id: toastid });
      void router.push("/dashboard/team");
    },
    onError: (error) => {
      toast.dismiss(toastid);
      toast.error(`Error occured ${error.message}`, { id: toastid });
      // console.log(error);
    },
  });
  return (
    <div className="my-10 md:m-20">
      <div className=" rounded-md  px-10">
        <h1 className="font-inter text-xl font-bold text-gray-600">
          Join Team
        </h1>
        <div className="my-20 flex flex-col justify-center gap-10">
          <label className="mr-3 text-sm font-semibold" htmlFor="">
            Referral Code
          </label>
          <input
            className="border-grey-600 rounded-full border-2  p-3 "
            type="text"
            placeholder="Referral Code"
            value={referral}
            onChange={(event) => {
              setReferral(event.target.value);
            }}
          />
          <label className="mr-3 text-sm font-semibold">
            Choose Your Role:
          </label>
          <select
            id="cars"
            name="cars"
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="border-grey-600 rounded-full border-2 bg-white p-3 px-5 "
          >
            <option value="member">Member</option>
            <option value="mentor">Mentor</option>
          </select>
          <button
            onClick={() => {
              void mutate.mutateAsync({ referral, type: role });
              document.body.style.overflow = "unset";
            }}
            className="Button gradient-btn blue-orange-gradient hover:orange-white-gradient  flex justify-center bg-gradient-to-bl text-base drop-shadow-lg hover:font-semibold hover:text-white"
          >
            <p className="mr-1 text-xl">
              <BsLightningFill />
            </p>
            Join Team
          </button>
        </div>
      </div>
    </div>
  );
};

export default Join;
