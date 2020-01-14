import React, { Fragment } from 'react';
import { withTranslation } from 'react-i18next';
import { DEFAULT_LIMIT } from '../../../constants/monitor';
import styles from '../table/table.css';
import Header from './header';
import Loading from './loading';
import Empty from './empty';
import FooterButton from '../box/footerButton';

const LoadMoreButton = withTranslation()(
  ({ t, children, onClick }) => <FooterButton onClick={onClick}>{t(children)}</FooterButton>,
);

const getUniqueKey = (data, index, key) => {
  if (typeof key === 'string' && !(/\./.test(key))) {
    return `table-row-${data[key]}`;
  }
  if (typeof key === 'function') {
    return `table-row-${key(data)}`;
  }
  return `table-row-${index}`;
};

const Table = ({
  data,
  loadData,
  header,
  row,
  currentSort,
  loadingState,
  isLoading,
  emptyState,
  key,
  canLoadMore,
}) => {
  const Row = row;
  return (
    <Fragment>
      {
        data.length
          ? (
            <Fragment>
              <Header data={header} currentSort={currentSort} />
              {data.map((item, index) =>
                <Row key={getUniqueKey(item, index, key)} data={item} className={styles.row} />)}
            </Fragment>
          ) : null
      }
      {
        isLoading ? <Loading data={loadingState} headerInfo={header} /> : null
      }
      {
        !isLoading && data.length === 0 ? <Empty data={emptyState} /> : null
      }
      {
        data.length >= DEFAULT_LIMIT
        && data.length % DEFAULT_LIMIT === 0
        && canLoadMore
          ? <LoadMoreButton onClick={loadData}>Load more</LoadMoreButton> : null
      }
    </Fragment>
  );
};

export default Table;
