import React from 'react';
import Box from '@theme/box';
import BoxContent from '@theme/box/content';
import Illustration from '@common/components/illustration';
import { useCurrentAccount } from '@account/hooks';
import { useTranslation } from 'react-i18next';
import { TransactionConfirmFooter } from '@hardwareWallet/components/TransactionConfirmFooter/TransactionConfirmFooter';
import styles from './HWConfirm.css';

const HWConfirm = () => {
  const { t } = useTranslation();
  const [currentAccount] = useCurrentAccount();

  return (
    <Box width="medium" className={`${styles.HWConfirm}`}>
      <BoxContent>
        <div>
          <Illustration name="hwLedgerConfirm" />
        </div>
        <h3 className={styles.headerText}>{t('Confirm your transaction')}</h3>
        <p className={styles.description}>
          {t('Please confirm the transaction on your {{deviceModel}}', {
            deviceModel: `${currentAccount?.hw?.manufacturer} ${currentAccount?.hw?.product}`,
          })}
        </p>
        <TransactionConfirmFooter className={styles.transactionConfirmFooterProp} />
      </BoxContent>
    </Box>
  );
};

export default HWConfirm;
