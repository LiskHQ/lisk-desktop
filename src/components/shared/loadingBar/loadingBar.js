import React, { useState, useEffect } from 'react';
import ProgressBar from '../../toolbox/progressBar/progressBar';
import styles from './loadingBar.css';

const LoadingBar = ({ markAsLoaded, loading, liskAPIClient }) => {
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [delay, setDelay] = useState(false);

  const markLoaded = () => {
    markAsLoaded(true);
    setLoaded(true);
  };

  useEffect(() => {
    if (liskAPIClient) setLoaded();

    return () => clearTimeout(delay);
  }, []);

  useEffect(() => {
    if (!loaded && liskAPIClient) markLoaded();
  }, [liskAPIClient]);

  useEffect(() => {
    if (loading && loading.length > 0 && !visible) {
      setVisible(new Date());
    }

    if (loading && loading.length === 0 && visible) {
      const timeDiff = new Date() - visible;
      const animationDuration = 1000;
      setDelay(
        setTimeout(() => {
          setVisible(false);
        }, animationDuration - (timeDiff % animationDuration)),
      );
    }
  }, [loading]);

  return (
    <div className={styles.fixedAtTop}>
      {visible
        ? <ProgressBar type="linear" mode="indeterminate" theme={styles} />
        : null
    }
    </div>
  );
};

export default LoadingBar;
