import React from 'react';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import styles from './loadingBar.css';

const LoadingBar = props => (
  <div className={styles.fixedAtTop}>
    {props.loading && props.loading.length ?
      <ProgressBar type="linear" mode="indeterminate" theme={styles}/> :
      null
    }
  </div>
);

export default LoadingBar;
