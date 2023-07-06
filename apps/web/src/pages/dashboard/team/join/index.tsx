import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import { BsLightningFill } from 'react-icons/bs';
import { AiOutlineLeft } from 'react-icons/ai';

import { api } from '~/utils/api';

const Join = () => {
  let toastid: string;
  const [referral, setReferral] = useState('');
  const router = useRouter();
  const mutate = api.team.join.useMutation({
    onMutate: () => {
      toast.loading('Joining team..', { id: toastid });
    },
    onSuccess: () => {
      toast.dismiss(toastid);
      toast.success('Joined team successfully', { id: toastid });
      void router.push('/dashboard/team');
    },
    onError: (error) => {
      toast.dismiss(toastid);
      toast.error(`Error occured ${error.message}`, { id: toastid });
      // console.log(error);
    },
  });
  return (
    <div className='my-10 md:m-20'>
      <div className=' rounded-md  px-10'>
        <button
          onClick={() => router.back()}
          className='my-10 flex items-center gap-2'
        >
          <AiOutlineLeft /> Go Back
        </button>
        <h1 className='font-inter text-xl font-bold text-gray-600'>
          Join Team
        </h1>
        <div className='my-10 flex flex-col justify-center gap-10'>
          <label className='mr-3 text-sm font-semibold' htmlFor=''>
            Referral Code
          </label>
          <input
            className='border-grey-600 rounded-full border-2  p-3 '
            type='text'
            placeholder='Referral Code'
            value={referral}
            onChange={(event) => {
              setReferral(event.target.value);
            }}
          />
          <button
            onClick={() => {
              void mutate.mutateAsync({ referral });
            }}
            className='Button gradient-btn blue-orange-gradient hover:orange-white-gradient  flex justify-center bg-gradient-to-bl text-base drop-shadow-lg hover:font-semibold hover:text-white'
          >
            <p className='mr-1 text-xl'>
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
