import React from 'react';
import styles from './offlineWrapper.css';

const OfflineWrapper = props => (
  <section className={!props.offline ? '' : styles.isOffline}>
    { props.children }
  </section>
);

export default OfflineWrapper;
