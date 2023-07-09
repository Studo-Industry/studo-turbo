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
        className={`${text} gradient-btn blue-orange-gradient hover:orange-white-gradient flex items-center justify-center bg-gradient-to-bl drop-shadow-lg hover:font-semibold hover:text-white`}
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
        className={`${text} blue-orange-gradient items-center rounded-full bg-gradient-to-bl px-1 py-1`}
      >
        <div className='h-full w-full rounded-full bg-white px-8 py-2 font-semibold'>
          {children}
        </div>
      </button>
    );
  }
};

export default Button;
