import React from 'react';
import { MODULE_COMMANDS_NAME_MAP } from 'src/modules/transaction/configuration/moduleCommand';
import Box from 'src/theme/box';
import BoxHeader from 'src/theme/box/header';
import { TertiaryButton } from 'src/theme/buttons';
import BoxContent from 'src/theme/box/content';
import Illustration from 'src/modules/common/components/illustration';
import Tooltip from 'src/theme/Tooltip';
import { tokenMap } from '@token/fungible/consts/tokens';
import Icon from 'src/theme/Icon';
import TransactionInfo from '../TransactionInfo';
import Footer from './footer';
import styles from './txSummarizer.css';
import FeeSummarizer from './FeeSummarizer';

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
  transaction,
  transactionData,
  selectedPriority,
  fees,
  hasCancel,
  noFeeStatus,
  confirmButtonText,
  cancelButtonText,
}) => {
  const fee = !(
    wallet.summary.isMultisignature ||
    rawTx.moduleCommand === MODULE_COMMANDS_NAME_MAP.registerMultisignatureGroup
  )
    ? rawTx.fee
    : 0;
  const tooltip = {
    title: t('Transaction fee'),
    children: t(
      'Transaction fees are required for every transaction to be accepted and forged by the {{network}} network. When the network is busy, transactions with a higher fee are confirmed sooner.',
      { network: tokenMap[token].label }
    ),
  };

  return (
    <Box width="medium" className={`${styles.wrapper} ${classNames} summary`}>
      {title && (
        <BoxHeader className={`${styles.header} summary-header`}>
          <TertiaryButton className="cancel-button" onClick={cancelButton.onClick}>
            <Icon name="arrowLeftTailed" />
          </TertiaryButton>
          &nbsp;&nbsp;&nbsp;
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
          transaction={transaction}
          transactionData={transactionData}
          token={token}
          summaryInfo={summaryInfo}
          rawTx={rawTx}
          account={wallet}
          isMultisignature={wallet.summary.isMultisignature}
          fees={fees}
        />
        {!noFeeStatus && !!fee && (
          <section>
            <div className={styles.feesWrapper}>
              <div>
                <label>
                  {t('Priority')}
                  <Tooltip title={tooltip.title} footer={tooltip.footer} position="right">
                    <p className={styles.tooltipText}>{tooltip.children}</p>
                  </Tooltip>
                </label>
                <div>{selectedPriority.title}</div>
              </div>
              <div>
                <label>
                  {t('Fees')}
                  <Tooltip title={tooltip.title} footer={tooltip.footer} position="top">
                    <p className={styles.tooltipText}>{tooltip.children}</p>
                  </Tooltip>
                </label>
                <FeeSummarizer fees={fees} />
              </div>
            </div>
          </section>
        )}
      </BoxContent>
      <Footer
        cancelButton={hasCancel && cancelButton}
        confirmButton={confirmButton}
        footerClassName={footerClassName}
        account={wallet}
        secondPassphraseStored={secondPassphraseStored}
        confirmButtonText={confirmButtonText}
        cancelButtonText={cancelButtonText}
        t={t}
      />
    </Box>
  );
};

export default TxSummarizer;
