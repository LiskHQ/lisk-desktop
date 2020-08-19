import React from 'react';
import styles from './rankOrStatus.css';
/**
 * This component acts as an adapter for diversions in consecutive versions of API
 *
 * @todo We should check if Lisk Service provides this. if so, we should show the rank.
 * @param {Object} data The delegate information
 * @param {String} className custom class names
 */
const RankOrStatus = ({
  // data,
  className,
}) => (
  // ? (
  //   <span className={`${styles.rank} ${className}`}>
  //     {`#${data.rank || '-'}`}
  //   </span>
  // )
  // : (
  <span className={`${styles.status} ${className}`}>
    {'active'}
  </span>
  // )
);

export default RankOrStatus;
