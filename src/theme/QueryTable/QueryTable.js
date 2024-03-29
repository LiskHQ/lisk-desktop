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
  onQueryChange,
  ...props
}) => {
  const data = queryHook(queryConfig);
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
    refetch,
  } = data;

  const handleClick = () => {
    // When the header is fixed at the top, the position is 50px
    // Therefore the page should only scroll into the view if the header is not at the top
    const headerTop = document.querySelector(`.${styles.header}`)?.getBoundingClientRect()?.top;
    if (headerTop && headerTop - window.scrollY <= 50) {
      document.querySelector(scrollToSelector).scrollIntoView(true);
    }
    addUpdate();
    button?.onClick?.();
  };

  const subHeader =
    hasUpdate &&
    (button.wrapperClassName ? (
      <div className={button.wrapperClassName}>
        <LoadNewButton buttonClassName={`${button.className || ''}`} handleClick={handleClick}>
          {button.label}
        </LoadNewButton>
      </div>
    ) : (
      <LoadNewButton buttonClassName={`${button.className || ''}`} handleClick={handleClick}>
        {button.label}
      </LoadNewButton>
    ));

  useEffect(() => {
    if (isFetched && typeof onFetched === 'function') {
      onFetched(response);
    }
  }, [isFetched]);

  useEffect(() => {
    onQueryChange?.(data);
  }, [data]);

  return (
    <Table
      data={transformResponse?.(response?.data) || response?.data || []}
      isLoading={isLoading}
      isFetching={isFetching}
      loadData={fetchNextPage}
      canLoadMore={hasNextPage}
      error={error}
      subHeader={subHeader}
      retry={refetch}
      {...props}
    />
  );
};
