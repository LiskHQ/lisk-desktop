import React from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '@theme/dialog/dialog';
import styles from './RequestSignMessageDialog.css';

// eslint-disable-next-line max-statements
const RequestSignMessageDialog = () => {
  const { t } = useTranslation();

  return (
    <Dialog className={styles.wrapper} hasClose>
      <h3>{t('RequestSignMessageDialog')}</h3>
    </Dialog>
  );
};

export default RequestSignMessageDialog;
