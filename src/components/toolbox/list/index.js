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

const Table = React.memo(({
  data,
  loadData,
  header,
  row,
  sort,
  loadingState,
  isLoading,
  emptyState,
}) => {
  const Row = row;
  return (
    <Fragment>
      {
        data.length
          ? (
            <Fragment>
              <Header data={header} sort={sort} />
              {data.map((item, index) =>
                <Row key={`table-row-${index}`} data={item} className={styles.row} />)}
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
        // @todo What if we hit end of the list?
        data.length >= DEFAULT_LIMIT
          ? <LoadMoreButton onClick={loadData}>Load more</LoadMoreButton> : null
      }
    </Fragment>
  );
});

export default Table;
