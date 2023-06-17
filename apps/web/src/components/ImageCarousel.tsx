import React from 'react';
import { useState } from 'react';
import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from 'react-icons/bs';

const ImageCarousel = ({ children: slides }: { children: JSX.Element[] }) => {
  const [curr, setCurr] = useState(0);
  const prev = () => {
    setCurr((curr) => (curr === 0 ? slides.length - 1 : curr - 1));
  };

  const next = () => {
    setCurr((curr) => (curr === slides.length - 1 ? 0 : curr + 1));
  };

  return (
    <div className='relative overflow-hidden'>
      <div
        className='flex transition-transform duration-500 ease-out '
        style={{ transform: `translateX(-${curr * 100}%)` }}
      >
        {slides}
      </div>
      <div className='absolute inset-0 flex items-center justify-between p-4'>
        <button
          onClick={prev}
          className='rounded-full p-1 text-gray-800 hover:bg-white'
        >
          <BsArrowLeftCircleFill size={28} />
        </button>
        <button
          onClick={next}
          className='rounded-full p-1 text-gray-800 hover:bg-white'
        >
          <BsArrowRightCircleFill size={28} />
        </button>
      </div>

      <div className='absolute bottom-4 left-0 right-4 '>
        <div className='flex items-center justify-center gap-2'>
          {' '}
          {slides?.map((_, i) => (
            <div
              key={i}
              className={`h-3 w-3 rounded-full bg-white transition-all ${
                curr === i ? 'p-2' : 'bg-opacity-50'
              }`}
            ></div>
          ))}{' '}
        </div>
      </div>
    </div>
  );
};

export default ImageCarousel;
