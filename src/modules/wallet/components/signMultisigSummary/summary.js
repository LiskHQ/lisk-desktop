/* eslint-disable complexity */
/* eslint-disable max-statements */
import React from 'react';
import { isEmpty } from 'src/utils/helpers';
import { useCurrentAccount } from 'src/modules/account/hooks';
import { signatureCollectionStatus } from '@transaction/configuration/txStatus';
import BoxContent from 'src/theme/box/content';
import Box from 'src/theme/box';
import { LayoutSchema } from '@transaction/components/TransactionDetails/layoutSchema';
import useTxInitiatorAccount from '@transaction/hooks/useTxInitiatorAccount';
import TransactionDetailsContext from '@transaction/context/transactionDetailsContext';
import layoutSchemaStyles from '@transaction/components/TransactionDetails/layoutSchema.css';
import usePosToken from '@pos/validator/hooks/usePosToken';
import ProgressBar from '../signMultisigView/progressBar';
import { ActionBar, Feedback } from './footer';
import styles from './styles.css';
import { useMultiSignatureStatus } from '../../hooks/useMultiSignatureStatus';

const Summary = ({ t, transactionJSON, formProps, account, nextStep, history, network }) => {
  const [currentAccount] = useCurrentAccount();
  const { token } = usePosToken();

  // This is to replace previous withData implementations.
  const { txInitiatorAccount: senderAccount } = useTxInitiatorAccount({
    senderPublicKey: transactionJSON.senderPublicKey,
  });

  const { isMember, signatureStatus, canSenderSignTx } = useMultiSignatureStatus({
    transactionJSON,
    account,
    currentAccount,
    senderAccount,
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

  if (isEmpty(senderAccount)) return <div />;

  const Layout = LayoutSchema[`${formProps.moduleCommand}-preview`] || LayoutSchema.default;

  return (
    <Box className={styles.boxContainer}>
      <header>
        <h1>{t('Sign multisignature transaction')}</h1>
        <p>
          {t(
            'If you have received a multisignature transaction that requires your signature, use this tool to review and sign it.'
          )}
        </p>
      </header>
      <BoxContent>
        <ProgressBar current={2} />
        <Box className={`${styles.container} ${styles.txDetails}`}>
          <BoxContent className={`${layoutSchemaStyles.mainContent} ${Layout.className}`}>
            <TransactionDetailsContext.Provider
              value={{
                token,
                network,
                wallet: senderAccount,
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
