import React from 'react';
import LiskAmount from '@shared/liskAmount';
import Box from '@toolbox/box';
import BoxHeader from '@toolbox/box/header';
import BoxContent from '@toolbox/box/content';
import Tooltip from '@toolbox/tooltip/tooltip';
import { tokenMap } from '@constants';
import Footer from './footer';
import styles from './transactionSummary.css';

const TransactionSummary = ({
  title, children, confirmButton, cancelButton,
  account, t, fee, secondPassphraseStored,
  classNames, token, footerClassName,
}) => {
  const tooltip = {
    title: t('Transaction fee'),
    children: t('Transaction fees are required for every transaction to be accepted and forged by the {{network}} network. When the network is busy, transactions with a higher fee are confirmed sooner.', { network: tokenMap[token].label }),
  };

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
        {account.loginType
        ? (
          <Illustration
            name={account.loginType}
            className={styles.illustrationWrapper}
          />
        )
        : null}
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
        account={account}
        secondPassphraseStored={secondPassphraseStored}
        t={t}
      />
    </Box>
  );
};

export default TransactionSummary;
