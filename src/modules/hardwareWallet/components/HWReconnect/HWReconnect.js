import React from 'react';
import Box from '@theme/box';
import BoxHeader from '@theme/box/header';
import BoxContent from '@theme/box/content';
import Illustration from '@common/components/illustration';
import { TransactionConfirmFooter } from '@hardwareWallet/components/TransactionConfirmFooter/TransactionConfirmFooter';
import { useTranslation } from 'react-i18next';
import styles from './HWReconnect.css';

const HWReconnect = () => {
  const { t } = useTranslation();

  return (
    <Box width="medium" className={styles.HWReconnect}>
      <BoxHeader className={styles.header}>
        <div>
          <Illustration name="hwReconnection" />
        </div>
        <h4>{t('Reconnect to hardware wallet')}</h4>
      </BoxHeader>
      <BoxContent className={styles.content}>
        <div className={styles.details}>
          <p>{t('Your hardware wallet is disconnected.')}</p>
          <p>{t('Please reconnect your hardware wallet to sign this transaction')}</p>
        </div>
        <TransactionConfirmFooter />
      </BoxContent>
    </Box>
  );
};

export default HWReconnect;
