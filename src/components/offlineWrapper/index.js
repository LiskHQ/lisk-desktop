import React from 'react';
import { connect } from 'react-redux';
import styles from './offlineWrapper.css';

export const OfflineWrapperComponent = props => (
  <section className={!props.offline ? '' : styles.isOffline}>
    { props.children }
  </section>
);


const mapStateToProps = state => ({
  offline: state.loading && state.loading.indexOf('offline') > -1,
});

export default connect(mapStateToProps)(OfflineWrapperComponent);
