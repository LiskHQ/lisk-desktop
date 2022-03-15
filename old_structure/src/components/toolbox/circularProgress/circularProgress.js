import React from 'react';
import PropTypes from 'prop-types';
import styles from './circularProgress.css';

const CircularProgress = ({ max, value, className }) => {
  let percentage = (value * 100) / max;
  percentage = percentage > 100 ? 100 : percentage;
  const error = value >= max;
  const radius = 7;
  const circunference = Math.PI * (radius * 2);
  const offset = ((100 - percentage) / 100) * circunference;

  return (
    <div className={className}>
      <svg width="20" height="20" viewBox="0 0 20 20">
        <circle
          r={radius}
          cx="10"
          cy="10"
          fill="transparent"
          strokeDasharray={circunference}
          strokeWidth="1"
          strokeDashoffset="0"
          className={styles.track}
        />
        <circle
          r={radius}
          cx="10"
          cy="10"
          fill="transparent"
          strokeDasharray={circunference}
          strokeWidth="1"
          strokeDashoffset={offset}
          className={`${styles.bar} ${error ? styles.error : ''}`}
        />
      </svg>
    </div>
  );
};

CircularProgress.propTypes = {
  max: PropTypes.number.isRequired,
  value: PropTypes.number,
  className: PropTypes.string,
};

CircularProgress.defaultProps = {
  value: 0,
  className: '',
};

export default CircularProgress;
