import mission from '~/images/about/mission.jpg';
import value1 from '~/images/about/value-1.jpg';
import value2 from '~/images/about/value-2.jpg';
import value3 from '~/images/about/value-3.jpg';

const About = () => {
  return (
    <div className='mx-10 my-10 flex flex-col gap-4 md:mx-20'>
      <h3 className='mb-10 text-2xl font-bold'>About Us</h3>
      <section className='flex h-[60vh] flex-col gap-4'>
        <p>
          Studoindustry is a revolutionary platform that connects students with
          industry to facilitate practical learning and real-world project
          experiences. Our platform serves as a bridge between academia and
          industry, offering students the opportunity to work on industrial
          projects provided by renowned companies.
        </p>

        <p>
          At Studoindustry, we believe that hands-on experience and exposure to
          real projects are crucial for students' professional development. Our
          platform enables students to gain practical skills, industry insights,
          and networking opportunities, preparing them for successful careers in
          their chosen fields.
        </p>
        <p>
          We partner with leading companies across various industries to offer a
          diverse range of projects, covering disciplines such as engineering,
          technology, design, and more. Students can apply for these projects
          and collaborate with industry professionals, gaining valuable
          experience and enhancing their skillsets.
        </p>
        <p>
          Through our platform, students can showcase their talent, connect with
          industry experts, and unlock exciting career opportunities. We are
          committed to empowering students and fostering a culture of
          innovation, growth, and collaboration.
        </p>
        <p>
          Join Studoindustry today and embark on a transformative journey that
          will shape your future and open doors to endless possibilities.
        </p>
      </section>
      <section className='flex h-[100vh] w-full items-center justify-center'>
        <img src={mission.src} alt='our mission' className='max-w-3xl' />
      </section>
      <section className='flex h-[100vh] items-center justify-center'>
        <img src={value1.src} alt='values' className='max-w-md' />
        <img src={value2.src} alt='values' className='max-w-md' />
        <img src={value3.src} alt='values' className='max-w-md' />
      </section>
    </div>
  );
};

export default About;
