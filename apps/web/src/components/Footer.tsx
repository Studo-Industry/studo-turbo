import Link from 'next/link';
import { IoLogoWhatsapp } from 'react-icons/io';
import { RiInstagramFill } from 'react-icons/ri';
import { AiFillTwitterCircle } from 'react-icons/ai';

const Footer = () => {
  return (
    <div
      className='blue-orange-gradient scroll-smooth bg-gradient-to-bl'
      id='footer'
    >
      <div className=' mb-0 flex flex-col px-10 py-6 pt-12 text-white md:flex-row md:justify-between md:px-32 '>
        <div>
          <div className='flex flex-col items-start gap-4 md:flex-row'>
            <div>
              <h1 className='text-4xl font-bold '>StudioIndustry</h1>
              <p className='pt-2 text-xs'>
                Lorem ipsum dolor sit amet consectetur <br /> adipisicing elit.
                Porro, fuga.
              </p>
            </div>
            <button className='Button blue-orange-gradient rounded-full bg-gradient-to-bl px-1 py-1'>
              <div className='h-full w-full whitespace-nowrap rounded-full bg-white px-8 py-2 text-base font-semibold text-gray-600'>
                Download App
              </div>
            </button>
          </div>
          <ul className='mt-10 flex flex-col gap-2 text-sm'>
            <li className='text-base font-bold'>Quick Links</li>
            <li>
              <Link href='/about'>About Us</Link>
            </li>
            <li>
              <Link href='/legal/terms'>Terms and Conditions</Link>
            </li>
            <li>
              <Link href='/legal/privacy-policy'>Privacy Policy</Link>
            </li>
          </ul>
        </div>

        <div className='my-12 md:my-0'>
          <div className='flex flex-col gap-3 md:flex-row'>
            <h1 className='mt-2 text-2xl font-medium'>Keep In Touch.</h1>

            <ul className='mx-3 mt-2 flex gap-6 text-3xl md:justify-evenly'>
              <a
                href='https://www.instagram.com/studoindustry_projects/'
                target='new'
              >
                <RiInstagramFill />
              </a>
              <a href='#'>
                <AiFillTwitterCircle />
              </a>
              <a href='#'>
                <IoLogoWhatsapp />
              </a>
            </ul>
          </div>

          <h3 className='mt-10 text-base font-bold'>Contact Us</h3>
          <ul className='mt-4 text-sm '>
            <li>
              Address - Lorem ipsum dolor sit amet consectetur <br />{' '}
              adipisicing elit. Repudiandae cumque voluptatem facilis!
            </li>
            <li>Email - studioindustry@gmail.com</li>
            <li>Phone - +91 75990 92690</li>
          </ul>
        </div>
      </div>

      <p className='pb-2 text-center text-xs text-white'>
        &#169; Studo Industry 2023
      </p>
    </div>
  );
};

export default Footer;
