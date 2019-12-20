import React from 'react';
import styles from './progressBar.css';

const ProgressBar = props => (
  <div className={[props.theme.linear, styles.linear, styles.indeterminate].join(' ')}>
    <span
      data-ref="buffer"
      className={[props.theme.buffer, styles.buffer].join(' ')}
    />
    <span
      data-ref="value"
      className={[props.theme.value, styles.value].join(' ')}
    />
  </div>
);

export default ProgressBar;
