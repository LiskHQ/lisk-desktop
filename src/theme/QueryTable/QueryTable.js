import React, { useEffect } from 'react';
import Table from '../table';
import { LoadNewButton } from './LoadNewButton';
import styles from '../table/stickyHeader/stickyHeader.css';

export const QueryTable = ({
  queryHook,
  queryConfig,
  button,
  scrollToSelector,
  transformResponse,
  onFetched,
  ...props
}) => {
  const {
    data: response,
    error,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    hasUpdate,
    addUpdate,
    isFetched,
  } = queryHook(queryConfig);

  const handleClick = () => {
    // When the header is fixed at the top, the position is 50px
    // Therefore the page should only scroll into the view if the header is not at the top
    if (
      document.querySelector(`.${styles.header}`).getBoundingClientRect().top - window.scrollY <=
      50
    ) {
      document.querySelector(scrollToSelector).scrollIntoView(true);
    }
    addUpdate();
  };

  const subHeader = !!hasUpdate && (
    <LoadNewButton buttonClassName={`${button.className || ''}`} handleClick={handleClick}>
      {button.label}
    </LoadNewButton>
  );

  useEffect(() => {
    if (isFetched && typeof onFetched === 'function') {
      onFetched(response);
    }
  }, [isFetched]);
  
  return (
    <Table
      data={transformResponse?.(response?.data) || response?.data || []}
      isLoading={isLoading}
      isFetching={isFetching}
      loadData={fetchNextPage}
      canLoadMore={hasNextPage}
      error={error}
      subHeader={subHeader}
      {...props}
    />
  );
};
