import React from 'react';
import LiskAmount from '@shared/liskAmount';
import Box from '@toolbox/box';
import BoxHeader from '@toolbox/box/header';
import BoxContent from '@toolbox/box/content';
import HardwareWalletIllustration from '@toolbox/hardwareWalletIllustration';
import Tooltip from '@toolbox/tooltip/tooltip';
import { tokenMap } from '@constants';
import Footer from './footer';
import styles from './transactionSummary.css';

const TransactionSummary = ({
  title, children, confirmButton, cancelButton,
  account, t, fee, transactionDoubleSigned,
  classNames, token, footerClassName,
}) => {
  const tooltip = {
    title: t('Transaction fee'),
    children: t('Transaction fees are required for every transaction to be accepted and forged by the {{network}} network. When the network is busy, transactions with a higher fee are confirmed sooner.', { network: tokenMap[token].label }),
  };

  const hasSecondPass = account.keys.numberOfSignatures === 2
    && account.keys.mandatoryKeys.length === 2 && account.keys.optionalKeys.length === 0;

  return (
    <Box width="medium" className={`${styles.wrapper} ${classNames} summary`}>
      {title && (
        <BoxHeader className="summary-header">
          <h2>
            {title}
          </h2>
        </BoxHeader>
      )}
      <BoxContent className={`${styles.content} summary-content`}>
        <HardwareWalletIllustration account={account} size="s" />
        {children}
        {fee && (
          <section>
            <label>
              {t('Transaction fee')}
              <Tooltip title={tooltip.title} footer={tooltip.footer} position="right">
                <p className={styles.tooltipText}>{tooltip.children}</p>
              </Tooltip>
            </label>
            <label className={`${styles.feeValue} fee-value`}>
              <LiskAmount val={fee} token={token} convert={false} />
            </label>
          </section>
        )}
      </BoxContent>
      <Footer
        confirmButton={confirmButton}
        cancelButton={cancelButton}
        footerClassName={footerClassName}
        hasSecondPass={hasSecondPass}
        transactionDoubleSigned={transactionDoubleSigned}
        t={t}
      />
    </Box>
  );
};

export default TransactionSummary;
