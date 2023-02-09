import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Dialog from '@theme/dialog/dialog';
import ValidatorPerformance from '../ValidatorPerformance';
import styles from './styles.css';

const ValidatorPerformanceModal = (props) => (
  <Dialog hasClose className={`${grid.row} ${grid['center-xs']} ${styles.wrapper}`}>
    <ValidatorPerformance {...props} />
  </Dialog>
);

export default ValidatorPerformanceModal;
