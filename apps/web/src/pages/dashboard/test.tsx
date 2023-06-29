import React, { useState } from 'react';
import { ProjectCard } from '~/components/Cards';
import PreLoader from '~/components/PreLoader';
import { api } from '~/utils/api';

const Test = () => {
  const [page, setPage] = useState(0);
  const { data, fetchNextPage, hasNextPage, hasPreviousPage, isFetching } =
    api.project.getBatch.useInfiniteQuery(
      {
        limit: 40,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );
  const handleFetchNextPage = () => {
    fetchNextPage();
    setPage((prev) => prev + 1);
  };

  const handleFetchPreviousPage = () => {
    setPage((prev) => prev - 1);
  };

  // data will be split in pages
  const toShow = data?.pages[page]?.items;

  return (
    <div className='m-10'>
      <div className='grid grid-cols-1 md:grid-cols-3'>
        {isFetching && (
          <div className='col-span-3'>
            <PreLoader />
          </div>
        )}
        {toShow?.map((project) => (
          <ProjectCard
            key={project.id}
            id={project.id}
            title={project.title}
            images={project.images}
          />
        ))}
      </div>
      {!hasPreviousPage && (
        <button
          onClick={() => handleFetchPreviousPage()}
          className='rounded-md bg-black p-4 text-white'
        >
          LoadPrevious
        </button>
      )}
      {!hasNextPage ? (
        <p> No more projects </p>
      ) : (
        <button
          onClick={() => handleFetchNextPage()}
          className='rounded-md bg-black p-4 text-white'
        >
          Load More
        </button>
      )}
    </div>
  );
};

export default Test;
