import Link from 'next/link';
import { IoLogoWhatsapp } from 'react-icons/io';
import { RiInstagramFill } from 'react-icons/ri';
import { AiFillTwitterCircle } from 'react-icons/ai';
import { useRouter } from 'next/router';

import Button from './Button';

const Footer = () => {
  const router = useRouter();
  return (
    <div
      className='blue-orange-gradient scroll-smooth bg-gradient-to-bl'
      id='footer'
    >
      <div className=' mb-0 flex flex-col px-10 py-6 pt-12 text-white md:flex-row md:justify-between md:px-32 '>
        <div>
          <div className='flex flex-col items-start gap-4 md:flex-row'>
            <div>
              <h1 className='text-4xl font-bold '>StudoIndustry</h1>
              <p className='pt-2 text-xs'>
                Bridging the gap between students and industry!
              </p>
            </div>
            <Button onClick={() => router.push('/coming-soon')} type='outline'>
              <p className='font-bold text-black'>Download App</p>
            </Button>
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
                href='https://instagram.com/studoindustry_projects'
                target='new'
              >
                <RiInstagramFill />
              </a>
              <a href='#' target='new'>
                <AiFillTwitterCircle />
              </a>
              <a href='https://wa.me/message/VZDVI4VQX7MOB1' target='new'>
                <IoLogoWhatsapp />
              </a>
            </ul>
          </div>

          <h3 className='mt-10 text-base font-bold'>Contact Us</h3>
          <ul className='mt-4 text-sm '>
            <li className='flex max-w-xl flex-wrap'>
              Address - 8 & 9, SIDDHIVINAYAK COMPLEX, KHANIWALI, AT POST
              KHANIWALI, TALUKA WADA, DIST-PALGHAR, MAHARASHTRA - 421312, INDIA
            </li>
            <li>Email - studioindustry@gmail.com</li>
            <li>Phone - +91 87678 38106</li>
          </ul>
        </div>
      </div>

      <p className='pb-4 text-center text-xs text-white'>
        &#169; Studo Industry 2023
      </p>
    </div>
  );
};

export default Footer;
