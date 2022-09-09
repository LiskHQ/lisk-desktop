import React, { useMemo } from 'react';
import { isEmpty } from 'src/utils/helpers';
import { signatureCollectionStatus } from '@transaction/configuration/txStatus';
import BoxContent from 'src/theme/box/content';
import Box from 'src/theme/box';
import { LayoutSchema } from '@transaction/components/TransactionDetails/layoutSchema';
import TransactionDetailsContext from '@transaction/context/transactionDetailsContext';
import layoutSchemaStyles from '@transaction/components/TransactionDetails/layoutSchema.css';
import ProgressBar from '../signMultisigView/progressBar';
import { showSignButton, getTransactionSignatureStatus } from '../signMultisigView/helpers';
import { ActionBar, Feedback } from './footer';
import styles from './styles.css';

const Summary = ({
  t,
  transaction,
  account,
  nextStep,
  history,
  senderAccount,
  activeToken,
  network,
}) => {
  const isMember = useMemo(() => {
    if (senderAccount.data.keys) {
      return showSignButton(senderAccount.data, account, transaction);
    }
    return null;
  }, [senderAccount.data]);

  const signatureStatus = useMemo(() => {
    if (senderAccount.data.keys) {
      return getTransactionSignatureStatus(senderAccount.data, transaction);
    }
    return null;
  }, [senderAccount.data]);

  const onClick = () => {
    nextStep({
      rawTx: transaction,
      sender: senderAccount,
      signatureStatus,
    });
  };

  const nextButton = {
    title: signatureStatus === signatureCollectionStatus.fullySigned ? t('Continue') : t('Sign'),
    onClick,
  };

  const showFeedback =
    !isMember ||
    signatureStatus === signatureCollectionStatus.fullySigned ||
    signatureStatus === signatureCollectionStatus.occupiedByOptionals;

  if (isEmpty(senderAccount.data)) {
    return <div />;
  }
  const Layout = LayoutSchema[`${transaction.moduleCommandID}-preview`] || LayoutSchema.default;

  return (
    <Box className={styles.boxContainer}>
      <header>
        <h1>{t('Sign multisignature transaction')}</h1>
        <p>
          {t('Provide a signature for a transaction which belongs to a multisignature account.')}
        </p>
      </header>
      <BoxContent>
        <ProgressBar current={2} />
        <Box className={`${styles.container} ${styles.txDetails}`}>
          <BoxContent className={`${layoutSchemaStyles.mainContent} ${Layout.className}`}>
            <TransactionDetailsContext.Provider
              value={{
                activeToken,
                network,
                wallet: senderAccount.data,
                transaction,
              }}
            >
              {Layout.components.map((Component, index) => (
                <Component key={index} t={t} />
              ))}
            </TransactionDetailsContext.Provider>
          </BoxContent>
        </Box>
      </BoxContent>
      {isMember ? <ActionBar t={t} history={history} nextButton={nextButton} /> : null}
      {showFeedback ? (
        <Feedback t={t} isMember={isMember} signatureStatus={signatureStatus} />
      ) : null}
    </Box>
  );
};
export default Summary;
