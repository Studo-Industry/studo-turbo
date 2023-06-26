import React, { useState } from 'react';
import { api } from '~/utils/api';

const Test = () => {
  const [page, setPage] = useState(0);
  const { data, fetchNextPage } = api.project.getBatch.useInfiniteQuery(
    {
      limit: 10,
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
    <div>
      <div>
        {toShow?.map((project) => (
          <p key={project.title}>{project.title}</p>
        ))}
      </div>
      <button onClick={() => handleFetchNextPage}>Load More</button>
    </div>
  );
};

export default Test;
