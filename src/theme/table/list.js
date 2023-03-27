import React from 'react';
import styles from './table.css';
import Header from './header';

const getUniqueKey = (data, index, key) => {
  if (typeof key === 'string' && !/\./.test(key)) {
    return `table-row-${data[key]}-${index}`;
  }
  if (typeof key === 'function') {
    return `table-row-${key(data)}`;
  }
  return `table-row-${index}`;
};

const List = ({
  data,
  header,
  headerClassName,
  subHeader,
  currentSort,
  iterationKey,
  Row,
  error,
  additionalRowProps,
  showHeader,
}) => {
  if ((data.length === 0 || error) && !showHeader) return null;
  return (
    <>
      {showHeader ? (
        <Header
          data={header}
          currentSort={currentSort}
          headerClassName={headerClassName}
          subHeader={subHeader}
        />
      ) : null}
      {data.map((item, index) => (
        <Row
          key={getUniqueKey(item, index, iterationKey)}
          index={index}
          data={item}
          className={styles.row}
          {...additionalRowProps}
        />
      ))}
    </>
  );
};

export default List;
