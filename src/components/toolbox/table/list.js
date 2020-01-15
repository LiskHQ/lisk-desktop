import React, { Fragment } from 'react';
import styles from './table.css';
import Header from './header';

const getUniqueKey = (data, index, key) => {
  if (typeof key === 'string' && !(/\./.test(key))) {
    return `table-row-${data[key]}`;
  }
  if (typeof key === 'function') {
    return `table-row-${key(data)}`;
  }
  return `table-row-${index}`;
};

const List = ({
  data, header, currentSort, key, Row, error,
}) => {
  if (data.length === 0 || error) return null;
  return (
    <Fragment>
      <Header data={header} currentSort={currentSort} />
      {data.map((item, index) =>
        <Row key={getUniqueKey(item, index, key)} data={item} className={styles.row} />)}
    </Fragment>
  );
};

export default List;
