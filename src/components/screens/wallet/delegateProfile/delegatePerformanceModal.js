import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Dialog from '@toolbox/dialog/dialog';
import DelegatePerformance from './delegatePerformance';
import styles from './styles.css';

const DelegatePerformanceModal = (props) => (
  <Dialog hasClose className={`${grid.row} ${grid['center-xs']} ${styles.container}`}>
    <DelegatePerformance {...props} title={`${props.title} details`} />
  </Dialog>
);

export default DelegatePerformanceModal;
