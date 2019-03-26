import React from 'react';
import styles from './byteCounter.css';

const ByteCounter = ({ max, value, className = '' }) => {
  const byteCount = encodeURI(value).split(/%..|./).length - 1;
  let percentage = (byteCount * 100) / max;
  percentage = percentage > 100 ? 100 : percentage;
  const error = byteCount >= max;
  const radius = 7;
  const circunference = Math.PI * (radius * 2);
  const offset = ((100 - percentage) / 100) * circunference;

  return (
    <div className={className}>
      <svg width="20" height="20" viewBox="0 0 20 20">
        <circle r={radius} cx="10" cy="10" fill="transparent"
          strokeDasharray={circunference} strokeWidth="1" strokeDashoffset="0"
          className={styles.track} />
        <circle r={radius} cx="10" cy="10" fill="transparent"
          strokeDasharray={circunference} strokeWidth="1" strokeDashoffset={offset}
          className={`${styles.bar} ${error ? styles.error : ''}`} />
      </svg>
    </div>
  );
};

export default ByteCounter;
