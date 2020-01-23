import React from 'react';
import { useSelector } from 'react-redux';
import styles from './rankOrStatus.css';
/**
 * This component acts as an adapter for diversions in consecutive versions of API
 * @param {Object} data The delegate information
 * @param {String} className custom class names
 * @param {Number} index The index of the item in the list
 */
const RankOrStatus = ({ data, className, index }) => {
  const apiVersion = useSelector(state => state.network.apiVersion);
  return (
    (apiVersion === '2.x')
      ? (
        <span className={`${styles.rank} ${className}`}>
          {`#${data.rank}`}
        </span>
      )
      : (
        <span className={`${styles.status} ${className}`}>
          {'active'}
        </span>
      )
  );
};

export default RankOrStatus;
