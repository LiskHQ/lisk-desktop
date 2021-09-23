import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Dialog from '@toolbox/dialog/dialog';
import DelegatePerformance from '../delegatePerformance';
import styles from '../delegateProfile/styles.css';

const DelegatePerformanceModal = (props) => (
  <Dialog hasClose className={`${grid.row} ${grid['center-xs']} ${styles.container}`}>
    <DelegatePerformance {...props} />
  </Dialog>
);

export default DelegatePerformanceModal;
