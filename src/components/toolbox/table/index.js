import React, { Fragment } from 'react';
import Loading from './loading';
import Empty from './empty';
import Error from './error';
import List from './list';
import LoadMoreButton from './loadMoreButton';

/**
 * The Table component is designed to make creating tables easy and centralized
 * so that by using this throughout the application, we keep the code DRY
 * and improve the onboarding process for the new developers.
 *
 * The table and it's components are all stateless. so they'll automatically react
 * against changes on the props.
 *
 * @param {Array} data
 * This parameter is the list of information required to aggregate the table rows.
 * The number of rows correspond the length of this property.
 * @param {Function} loadData
 * TheTable component passes this function to the load more button, so every time
 * the users clicks on it, a new set of data gets prepended.
 * Please note since the table is stateless you must handle the offset of items
 * on the parent element.
 * @param {Array} header
 * you can pass an array as header in which every element can have the following:
 * title {String} - the name appeared above the column. translations must be handled.
 * classList {String} - The stringified list of class names (at least to define the width/grid)
 * toolTip {Object} - including message and title as (translated) strings
 * sort {Object} - In the shape of
 *  {
 *    fn: changeSortFunction,
 *    key: 'keyName',
 *  }
 * it helps you to define which function and ith what parameter to be called for sorting.
 * @param {Function} row
 * A component, preferably a pure component with update condition handled through
 * shouldComponentUpdate method or areEqual function. this will help keep the
 * rendering rounds to a minimum.
 * @param {String} currentSort
 * one of the properties of each item in the data array or null.
 * @param {Function} loadingState
 * A valid react component to be shown when the table is loading data
 * @param {Boolean} isLoading
 * Determines if the data is being loaded or not. the other states are error and success.
 * @param {Function|Object} emptyState
 * You can pass a valid react component, or simply an object with message and illustration name:
 * {
 *   message: 'There are no bookmarks to show.',
 *   illustration: 'emptyBookmarkList',
 * }
 * @param {String|Function} iterationKey
 * This is used to create a unique iteration key for the list.
 * You may simply pass a property name like 'id' or 'username'.
 * You can also pass a filter function like `data => data.account.address`
 * @param {Boolean} canLoadMore
 * Determines if the load more button should be shown.
 * @param {Object} error
 * The error object containing the error message if any. If this is not null
 * or an empty string, the Table will show an error template.
 * @param {Object} additionalRowProps
 * If there are some other data that must be passed to the Row element
 * you can use this property.
 */
const Table = ({
  data,
  loadData,
  header,
  row,
  currentSort,
  loadingState,
  isLoading,
  emptyState,
  iterationKey,
  canLoadMore,
  error,
  additionalRowProps,
}) => {
  const Row = row;
  return (
    <Fragment>
      <List
        data={data}
        header={header}
        currentSort={currentSort}
        iterationKey={iterationKey}
        Row={Row}
        error={error}
        additionalRowProps={additionalRowProps || {}}
      />
      <Loading
        Element={loadingState}
        headerInfo={header}
        isLoading={isLoading}
      />
      <Empty
        data={emptyState}
        error={error}
        isLoading={isLoading}
        isListEmpty={data.length === 0}
      />
      <Error data={error} isLoading={isLoading} />
      <LoadMoreButton
        onClick={loadData}
        dataLength={data.length}
        canLoadMore={canLoadMore}
        error={error}
      />
    </Fragment>
  );
};

export default Table;
