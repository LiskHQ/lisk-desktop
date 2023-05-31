import React from 'react';
import { useLocation } from 'react-router-dom';
import Dialog from '@theme/dialog/dialog';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Box from 'src/theme/box';
import BoxHeader from 'src/theme/box/header';
import BoxContent from 'src/theme/box/content';
import { PrimaryButton, OutlineButton } from 'src/theme/buttons';
import styles from './ConfirmationDialog.css';

const ConfirmationDialog = () => {
  const location = useLocation();
  const { header, content, cancelText, onCancel, confirmText, onConfirm } = location.state ?? {};
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
              <OutlineButton className={styles.cancelBtn} onClick={onCancel}>
                {cancelText ?? 'Cancel'}
              </OutlineButton>
            </div>
            <div className={grid['col-xs-6']}>
              <PrimaryButton className={styles.confirmBtn} onClick={onConfirm}>
                {confirmText ?? 'Continue'}
              </PrimaryButton>
            </div>
          </div>
        </BoxContent>
      </Box>
    </Dialog>
  );
};

export default ConfirmationDialog;
