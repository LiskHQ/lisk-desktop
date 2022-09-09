import React from 'react';
import Table from '../table';
import { LoadNewButton } from './LoadNewButton';
import styles from '../table/stickyHeader/stickyHeader.css';

// eslint-disable-next-line import/prefer-default-export
export const QueryTable = ({ queryHook, queryConfig, button, scrollToSelector, ...props }) => {
  const {
    data: response,
    error,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    hasUpdate,
    addUpdate,
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

  const subHeader = hasUpdate ? (
    <LoadNewButton buttonClassName={`${button.className || ''}`} handleClick={handleClick}>
      {button.label}
    </LoadNewButton>
  ) : null;

  return (
    <Table
      data={response?.data || []}
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
