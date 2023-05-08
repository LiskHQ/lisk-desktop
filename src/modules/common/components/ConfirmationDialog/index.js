import React from 'react';
import { withRouter } from 'react-router';
import Dialog from '@theme/dialog/dialog';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Box from 'src/theme/box';
import BoxHeader from 'src/theme/box/header';
import BoxContent from 'src/theme/box/content';
import { PrimaryButton, OutlineButton } from 'src/theme/buttons';
import styles from './ConfirmationDialog.css';

const ConfirmationDialog = ({ location }) => {
  const { header, content, cancelText, cancelFn, confirmText, confirmFn } = location.state ?? {};
  return (
    <Dialog hasClose className={styles.wrapper}>
      <Box className={styles.container}>
        <BoxHeader>
          <h2>{header ?? 'Confirm'}</h2>
        </BoxHeader>
        <BoxContent>
          <div className={`${grid.row} ${styles.content}`}>
            <p>{content ?? 'Are you sure?'}</p>
          </div>
          <div className={grid.row}>
            <div className={grid['col-xs-6']}>
              <OutlineButton className={styles.cancelBtn} onClick={cancelFn}>
                {cancelText ?? 'Cancel switch'}
              </OutlineButton>
            </div>
            <div className={grid['col-xs-6']}>
              <PrimaryButton className={styles.confirmBtn} onClick={confirmFn}>
                {confirmText ?? 'Continue to switch'}
              </PrimaryButton>
            </div>
          </div>
        </BoxContent>
      </Box>
    </Dialog>
  );
};

export default withRouter(ConfirmationDialog);
