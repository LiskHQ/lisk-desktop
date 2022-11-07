import React from 'react';
import { isEmpty } from 'src/utils/helpers';
import { useCurrentAccount } from 'src/modules/account/hooks';
import { signatureCollectionStatus } from '@transaction/configuration/txStatus';
import BoxContent from 'src/theme/box/content';
import Box from 'src/theme/box';
import { LayoutSchema } from '@transaction/components/TransactionDetails/layoutSchema';
import TransactionDetailsContext from '@transaction/context/transactionDetailsContext';
import layoutSchemaStyles from '@transaction/components/TransactionDetails/layoutSchema.css';
import ProgressBar from '../signMultisigView/progressBar';
import { ActionBar, Feedback } from './footer';
import styles from './styles.css';
import { useMultiSignatureStatus } from '../../hooks/useMultiSignatureStatus';

// eslint-disable-next-line complexity
const Summary = ({
  t,
  transactionJSON,
  formProps,
  account,
  nextStep,
  history,
  senderAccount,
  activeToken,
  network,
}) => {
  const [currentAccount] = useCurrentAccount();

  const { isMember, signatureStatus, canSenderSignTx } = useMultiSignatureStatus({
    transactionJSON,
    account,
    currentAccount,
    senderAccount: senderAccount.data,
  });

  const onClick = () => {
    nextStep({
      formProps,
      transactionJSON,
      sender: senderAccount,
      signatureStatus,
    });
  };

  const nextButton = {
    title: signatureStatus === signatureCollectionStatus.fullySigned ? t('Continue') : t('Sign'),
    onClick,
  };

  const showFeedback =
    !(isMember || canSenderSignTx) ||
    (signatureStatus === signatureCollectionStatus.fullySigned && !canSenderSignTx) ||
    (signatureStatus === signatureCollectionStatus.occupiedByOptionals && !canSenderSignTx);

  if (isEmpty(senderAccount.data)) {
    return <div />;
  }
  const Layout = LayoutSchema[`${formProps.moduleCommand}-preview`] || LayoutSchema.default;
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
                transaction: transactionJSON,
              }}
            >
              {Layout.components.map((Component, index) => (
                <Component key={index} t={t} />
              ))}
            </TransactionDetailsContext.Provider>
          </BoxContent>
        </Box>
      </BoxContent>

      {((isMember &&
        signatureStatus !== signatureCollectionStatus.fullySigned &&
        signatureStatus !== signatureCollectionStatus.occupiedByOptionals) ||
        canSenderSignTx) && <ActionBar t={t} history={history} nextButton={nextButton} />}

      {showFeedback ? (
        <Feedback t={t} isMember={isMember || canSenderSignTx} signatureStatus={signatureStatus} />
      ) : null}
    </Box>
  );
};
export default Summary;
