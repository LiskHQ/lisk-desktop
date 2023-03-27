import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Skeleton from '../../../modules/common/components/skeleton';
import styles from './TableLoadingState.css';

const TableLoadingState = ({ header, count, isFetching }) => {
  if (!isFetching) return null;
  return [...new Array(count).values()].map((_, idx) => (
    <div
      key={idx}
      data-testid="skeleton-row"
      className={`${styles.skeletonRowWrapper} ${grid.row}`}
    >
      {header.map((field, index) => (
        <div className={field.classList} key={`${index}-${idx}`}>
          <Skeleton theme={field.placeholder ?? 'rect'} />
        </div>
      ))}
    </div>
  ));
};

export default TableLoadingState;
