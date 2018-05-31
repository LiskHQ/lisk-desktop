import React from 'react';
import styles from './resultList.css';

const resultList = ({
  entities,
  entityKey,
  uniqueKey,
  redirectPath,
  keyHeader,
  keyValue,
  i18Header,
  i18Value,
  entityIdxStart,
  selectedIdx,
  submitSearch,
  selectedRowProps,
}) => {
  const targetRows = entities.map((entity, idx) => {
    const isSelectedRow = selectedIdx === entityIdxStart + idx;
    let rowProps = {
      onClick: () => submitSearch(redirectPath(entity)),
      className: `${styles.row} ${styles.rowResult} ${isSelectedRow ? styles.rowSelected : ''} ${entityKey}-result`,
    };
    if (isSelectedRow) {
      rowProps = { ...rowProps, ...selectedRowProps };
    }
    return <li {...rowProps} key={entity[uniqueKey]}>
      <span>{entity[keyHeader]}</span>
      {
        keyValue(entity)
      }
    </li>;
  });
  return <ul className={styles.resultList} key={entityKey}>
    <li className={`${styles.row} ${styles.heading} ${entityKey}-header`}>
      <span>{i18Header}</span>
      <span>{i18Value}</span>
    </li>
    {targetRows}
  </ul>;
};

export default resultList;
