import { getSession, useSession } from 'next-auth/react';
import { GetServerSidePropsContext } from 'next';

import { api } from '~/utils/api';
import PreLoader from '~/components/PreLoader';
import { ProjectCard } from '~/components/Cards';
import Error from '~/components/Error';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);
  return {
    props: {
      data: session,
    },
  };
}

const Wishlist = () => {
  const session = useSession();
  const { data: user, status: userStatus } = api.user.getOne.useQuery({
    id: session.data?.user.id!,
  });
  return (
    <div className='px-8 py-20 md:px-20'>
      <h2 className='pb-10 text-xl font-bold'>Wishlist</h2>
      <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
        {userStatus === 'loading' && (
          <div className='md:col-span-3'>
            <PreLoader />
          </div>
        )}
        {userStatus === 'error' && (
          <Error error='Error Loading data, Please try again in some time.' />
        )}
        {userStatus === 'success' ? (
          user?.wishlist.length !== 0 ? (
            user?.wishlist.map((project) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                images={project.images}
                title={project.title}
              />
            ))
          ) : (
            <div className='flex h-[40vh] w-full items-center justify-center md:col-span-3'>
              No wishlisted Projects yet
            </div>
          )
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
