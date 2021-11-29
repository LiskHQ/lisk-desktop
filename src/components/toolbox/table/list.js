import React from 'react';
import styles from './table.css';
import Header from './header';

const getUniqueKey = (data, index, key) => {
  if (typeof key === 'string' && !(/\./.test(key))) {
    return `table-row-${data[key]}-${index}`;
  }
  if (typeof key === 'function') {
    return `table-row-${key(data)}`;
  }
  return `table-row-${index}`;
};

const List = ({
  data, header, headerClassName, currentSort, iterationKey, Row, error, additionalRowProps,
}) => {
  if (data.length === 0 || error) return null;
  return (
    <>
      <Header data={header} currentSort={currentSort} headerClassName={headerClassName} />
      {data.map((item, index) => (
        <Row
          key={getUniqueKey(item, index, iterationKey)}
          data={item}
          className={styles.row}
          {...additionalRowProps}
        />
      ))}
    </>
  );
};

export default List;
