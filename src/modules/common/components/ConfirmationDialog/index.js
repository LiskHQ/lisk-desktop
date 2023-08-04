import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import Dialog from '@theme/dialog/dialog';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Box from 'src/theme/box';
import BoxHeader from 'src/theme/box/header';
import BoxContent from 'src/theme/box/content';
import { PrimaryButton, OutlineButton } from 'src/theme/buttons';
import styles from './ConfirmationDialog.css';

const ConfirmationDialog = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { header, content, cancelText, onCancel, confirmText, onConfirm } = location.state ?? {};
  return (
    <Dialog hasClose className={styles.wrapper}>
      <Box className={styles.container}>
        <BoxHeader>
          <h2>{header ?? t('Confirm')}</h2>
        </BoxHeader>
        <BoxContent>
          <div className={`${grid.row} ${styles.content}`}>
            <p>{content ?? t('Are you sure?')}</p>
          </div>
          <div className={grid.row}>
            <div className={grid['col-xs-6']}>
              <OutlineButton className={styles.cancelBtn} onClick={onCancel}>
                {cancelText ?? t('Cancel')}
              </OutlineButton>
            </div>
            <div className={grid['col-xs-6']}>
              <PrimaryButton className={styles.confirmBtn} onClick={onConfirm}>
                {confirmText ?? t('Continue')}
              </PrimaryButton>
            </div>
          </div>
        </BoxContent>
      </Box>
    </Dialog>
  );
};

export default ConfirmationDialog;
