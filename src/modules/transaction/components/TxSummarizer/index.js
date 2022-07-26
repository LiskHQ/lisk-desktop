import React from 'react';
import TokenAmount from '@token/fungible/components/tokenAmount';
import { MODULE_COMMANDS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
import Box from 'src/theme/box';
import BoxHeader from 'src/theme/box/header';
import BoxContent from 'src/theme/box/content';
import Illustration from 'src/modules/common/components/illustration';
import Tooltip from 'src/theme/Tooltip';
import { tokenMap } from '@token/fungible/consts/tokens';
import TransactionInfo from '../TransactionInfo';
import Footer from './footer';
import styles from './txSummarizer.css';

const TxSummarizer = ({
  title,
  children,
  confirmButton,
  cancelButton,
  wallet,
  t,
  secondPassphraseStored,
  classNames,
  token,
  footerClassName,
  rawTx,
  summaryInfo,
}) => {
  const fee = !(wallet.summary.isMultisignature
    || rawTx.moduleCommandID === MODULE_COMMANDS_NAME_ID_MAP.registerMultisignatureGroup
  ) ? rawTx.fee : 0;
  const tooltip = {
    title: t('Transaction fee'),
    children: t(
      'Transaction fees are required for every transaction to be accepted and forged by the {{network}} network. When the network is busy, transactions with a higher fee are confirmed sooner.',
      { network: tokenMap[token].label },
    ),
  };

  return (
    <Box width="medium" className={`${styles.wrapper} ${classNames} summary`}>
      {title && (
        <BoxHeader className="summary-header">
          <h2>{title}</h2>
        </BoxHeader>
      )}
      <BoxContent className={`${styles.content} summary-content`}>
        {wallet.loginType ? (
          <Illustration
            name={wallet.loginType}
            className={`${styles.illustrationWrapper} illustration`}
          />
        ) : null}
        {children}
        <TransactionInfo
          token={token}
          summaryInfo={summaryInfo}
          rawTx={rawTx}
          account={wallet}
          isMultisignature={wallet.summary.isMultisignature}
        />
        {fee ? (
          <section className="regular-tx-fee">
            <label>
              {t('Transaction fee')}
              <Tooltip
                title={tooltip.title}
                footer={tooltip.footer}
                position="right"
              >
                <p className={styles.tooltipText}>{tooltip.children}</p>
              </Tooltip>
            </label>
            <label className={`${styles.feeValue} fee-value`}>
              <TokenAmount val={fee} token={token} />
            </label>
          </section>
        ) : null}
      </BoxContent>
      <Footer
        confirmButton={confirmButton}
        cancelButton={cancelButton}
        footerClassName={footerClassName}
        account={wallet}
        secondPassphraseStored={secondPassphraseStored}
        t={t}
      />
    </Box>
  );
};

export default TxSummarizer;
