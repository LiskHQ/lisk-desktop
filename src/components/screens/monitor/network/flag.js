import React from 'react';
import styles from './flag.css';

const Flag = ({ code }) => {
  const flagStyle = code && styles[code];
  return (
    <div className={`${styles.flag} ${flagStyle ? styles.bordered : null}`}>
      {
        flagStyle
          ? <span className={`${styles.sprite} ${flagStyle}`} />
          : '-'
      }
    </div>
  );
};

export default Flag;
