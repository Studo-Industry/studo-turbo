import React from 'react';
import FAQ from '~/components/FAQ';
import guideline1 from "~/images/guidelines/1.jpg"
import guideline2 from "~/images/guidelines/2.jpg"
import guideline3 from "~/images/guidelines/3.jpg"
import guideline4 from "~/images/guidelines/4.jpg"
import guideline5 from "~/images/guidelines/5.jpg"
import guideline6 from "~/images/guidelines/6.jpg"
import guideline7 from "~/images/guidelines/7.jpg"
import guideline8 from "~/images/guidelines/8.jpg"
import guideline9 from "~/images/guidelines/9.jpg"
import guideline10 from "~/images/guidelines/10.jpg"
import Image from 'next/image';

const guidelines = [
  guideline1,
  guideline2,
  guideline3,
  guideline4,
  guideline5,
  guideline6,
  guideline7,
  guideline8,
  guideline9,
  guideline10
]

const questionNo = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
];
const Help = () => {
  return (
    <div>
      <div className='my-20'>
        <h1 className='mx-10 my-10 text-2xl font-bold'>How to Use</h1>
        <div className='flex flex-col items-center gap-10 m-10'>
          {guidelines.map((guideline) => (
              <Image key={guideline.src} src={guideline} height={100} width={1000} alt='guideline' className='my-2 rounded-lg shadow-md' />
          ))}
        </div>
      </div>
      <div>
        <h1 className='mx-10 my-10 text-2xl font-bold'>FAQ&#39;s</h1>
        <div>
          {questionNo?.map((question, index) => (
            <FAQ key={index} que={question} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Help;
