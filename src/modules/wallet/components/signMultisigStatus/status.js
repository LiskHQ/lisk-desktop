import React from 'react';
import Box from 'src/theme/box';
import BoxContent from 'src/theme/box/content';
import TxBroadcaster from '@transaction/components/TxBroadcaster';
import { useCurrentAccount } from '@account/hooks';
import { statusMessages, getTransactionStatus } from '@transaction/configuration/statusConfig';
import useTxInitatorAccount from '@transaction/hooks/useTxInitiatorAccount';

import ProgressBar from '../signMultisigView/progressBar';
import styles from './styles.css';
import { useMultiSignatureStatus } from '../../hooks/useMultiSignatureStatus';

// eslint-disable-next-line max-statements
const Status = ({ transactions, t, transactionJSON }) => {
  const isMultiSignature = transactions.signedTransaction.params?.numberOfSignatures > 0;
  const [currentAccount] = useCurrentAccount();

  // This is to replace previous withData implementations.
  const { txInitatorAccount } = useTxInitatorAccount({
    transactionJSON,
  });
  const { mandatoryKeys, optionalKeys, numberOfSignatures, publickKey } = txInitatorAccount;

  const { canSenderSignTx } = useMultiSignatureStatus({
    transactionJSON,
    currentAccount,
    senderAccount: txInitatorAccount,
    account: {
      mandatoryKeys,
      optionalKeys,
      numberOfSignatures,
      summary: {
        publickKey,
      },
    },
  });

  const status = getTransactionStatus(
    txInitatorAccount,
    transactions,
    isMultiSignature,
    canSenderSignTx
  );

  const template = statusMessages(t)[status.code];
  return (
    <section>
      <Box className={styles.boxContainer}>
        <header>
          <h1>{t('Sign multisignature transaction')}</h1>
          <p>
            {t('Provide a signature for a transaction which belongs to a multisignature account.')}
          </p>
        </header>
        <BoxContent>
          <ProgressBar current={4} />
          <TxBroadcaster
            message={template.message}
            title={template.title}
            illustration="signMultisignature"
            className={styles.content}
            status={status}
          />
        </BoxContent>
      </Box>
    </section>
  );
};

export default Status;
