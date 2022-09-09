import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Dialog from '@theme/dialog/dialog';
import DelegatePerformance from '../delegatePerformance';
import styles from './styles.css';

const DelegatePerformanceModal = (props) => (
  <Dialog hasClose className={`${grid.row} ${grid['center-xs']} ${styles.wrapper}`}>
    <DelegatePerformance {...props} />
  </Dialog>
);

export default DelegatePerformanceModal;
