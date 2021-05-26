import React, { useEffect } from 'react';

import LiskAmount from '@shared/liskAmount';
import Box from '@toolbox/box';
import BoxHeader from '@toolbox/box/header';
import BoxContent from '@toolbox/box/content';
import HardwareWalletIllustration from '@toolbox/hardwareWalletIllustration';
import Tooltip from '@toolbox/tooltip/tooltip';
import { tokenMap } from '@constants';

import Footer from './footer';
import styles from './transactionSummary.css';

const tooltips = {
  LSK: {
    title: 'Transaction fee',
    children: `Every transaction needs to be confirmed and forged into Lisk blockchain network. 
                Such operations require hardware resources and because of that there is a small fee for processing those.`,
  },
  BTC: {
    children: 'Bitcoin transactions are made with some delay that depends on two parameters: the fee and the bitcoin network’s congestion. The higher the fee, the higher the processing speed.',
  },
};

const TransactionSummary = ({
  account, confirmButton,
  title, children, cancelButton, createTransaction, t,
  fee, classNames, token, footerClassName,
}) => {
  const activeAccount = account.info ? account.info[token] : null;
  const isHW = !!(activeAccount?.hwInfo && activeAccount?.hwInfo.deviceId);

  useEffect(() => {
    if (isHW && !confirmButton.disabled) {
      confirmButton.onClick();
    }
  }, [confirmButton.disabled]);

  return (
    <Box width="medium" className={`${styles.wrapper} ${classNames} summary`}>
      {title && (
        <BoxHeader className="summary-header">
          <h2>
            {title}
            {isHW ? t(' - Confirm transaction on your {{deviceModel}}', { deviceModel: activeAccount.hwInfo.deviceModel }) : ''}
          </h2>
        </BoxHeader>
      )}
      <BoxContent className={`${styles.content} summary-content`}>
        <HardwareWalletIllustration account={activeAccount} size="s" />
        {children}
        {
          fee ? (
            <section>
              <label>
                {t('Transaction fee')}
                <Tooltip title={t(tooltips[token].title)} position="right">
                  <p className={styles.tooltipText}>{t(tooltips[token].children)}</p>
                </Tooltip>
              </label>
              <label className={`${styles.feeValue} fee-value`}>
                <LiskAmount val={fee} token={token} convert={false} />
              </label>
            </section>
          ) : null
        }
      </BoxContent>
      {!isHW && (
        <Footer
          confirmButton={confirmButton}
          cancelButton={cancelButton}
          footerClassName={footerClassName}
          createTransaction={createTransaction}
          isMultisignature={token === tokenMap.LSK.key && activeAccount.summary.isMultisignature}
          t={t}
        />
      )}
    </Box>
  );
};

export default TransactionSummary;
