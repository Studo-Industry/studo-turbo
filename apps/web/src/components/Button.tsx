import React from 'react';

const Button = ({
  type,
  onClick,
  children,
  icon,
  text,
}: {
  type: 'normal' | 'outline';
  onClick(): unknown;
  children: string | JSX.Element | JSX.Element[];
  icon?: JSX.Element;
  text?: 'text-xs' | 'text-md' | 'text-lg' | 'text-xl';
}) => {
  if (type === 'normal') {
    return (
      <button
        onClick={() => onClick()}
        className={`${text} gradient-btn blue-orange-gradient hover:orange-white-gradient flex items-center justify-center bg-gradient-to-bl drop-shadow-lg  hover:font-semibold `}
      >
        <div className='flex items-center gap-2'>
          {icon}
          {children}
        </div>
      </button>
    );
  }
  if (type === 'outline') {
    return (
      <button
        onClick={() => onClick()}
        className={`${text} blue-orange-gradient flex items-center justify-center rounded-full bg-gradient-to-bl px-1 py-1  hover:scale-105`}
      >
        <div className='flex h-full w-full items-center justify-center rounded-full bg-white px-8 py-2 font-semibold hover:bg-transparent hover:text-white'>
          {children}
        </div>
      </button>
    );
  }
};

export default Button;
