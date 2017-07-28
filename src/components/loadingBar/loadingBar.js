import React from 'react';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import styles from './loadingBar.css';

const LoadingBar = props => (
  <div className={styles.fixedAtTop}>
    {props.loadingBar && props.loadingBar.length ?
      <ProgressBar type="linear" mode="indeterminate" /> :
      null
    }
  </div>
);

export default LoadingBar;
