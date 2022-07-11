/* eslint-disable max-lines */
import React from 'react';
import Dialog from '@theme/dialog/dialog';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from './RemoveApplicationSuccess.css';

const RemoveApplicationSuccess = () => (
  <Dialog hasClose className={`${styles.dialogWrapper} ${grid.row} ${grid['center-xs']}`}>
    <div className={styles.wrapper}>
      <span>Application has now been removed</span>
    </div>
  </Dialog>
);

export default RemoveApplicationSuccess;
