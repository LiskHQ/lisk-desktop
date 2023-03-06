import React from 'react';
import Dialog from 'src/theme/dialog/dialog';
import Box from '@theme/box';
import BoxHeader from '@theme/box/header';
import BoxContent from '@theme/box/content';
import Illustration from '@common/components/illustration';
import { TransactionConfirmFooter } from '@hardwareWallet/components/TransactionConfirmFooter/TransactionConfirmFooter';
import styles from './HWReconnect.css';

const HWReconnect = () => (
  <Dialog className={styles.container} hasClose hasBack size="sm">
    <Box className={styles.wrapper}>
      <BoxHeader className={styles.header}>
        <div>
          <Illustration name="hwReconnection" />
        </div>
        <h4>Reconnect to hardware wallet</h4>
      </BoxHeader>
      <BoxContent className={styles.content}>
        <div className={styles.details}>
          <p>Your hardware wallet is disconnected.</p>
          <p>Please reconnect your hardware wallet to sign this transaction</p>
        </div>
        <TransactionConfirmFooter />
      </BoxContent>
    </Box>
  </Dialog>
);

export default HWReconnect;
