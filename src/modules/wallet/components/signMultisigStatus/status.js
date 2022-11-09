import React, { useMemo } from 'react';
import Box from 'src/theme/box';
import BoxContent from 'src/theme/box/content';
import { useAuth } from 'src/modules/auth/hooks/queries';
import TxBroadcaster from '@transaction/components/TxBroadcaster';
import { useCurrentAccount } from '@account/hooks';
import { statusMessages, getTransactionStatus } from '@transaction/configuration/statusConfig';

import ProgressBar from '../signMultisigView/progressBar';
import styles from './styles.css';
import { useMultiSignatureStatus } from '../../hooks/useMultiSignatureStatus';

const Status = ({ sender, transactions, t, transactionJSON }) => {
  const isMultiSignature = transactions.signedTransaction.params?.numberOfSignatures > 0;
  const [currentAccount] = useCurrentAccount();

  const { data, isLoading: isGettingAuthData } = useAuth({
    config: { params: { address: currentAccount.metadata.address } },
  });

  const { mandatoryKeys, optionalKeys, numberOfSignatures, publickKey } = useMemo(
    () => ({ ...data?.data, ...data?.meta }),
    [isGettingAuthData]
  );

  const { canSenderSignTx } = useMultiSignatureStatus({
    senderAccount: sender.data,
    transactionJSON,
    currentAccount,
    account: {
      mandatoryKeys,
      optionalKeys,
      numberOfSignatures,
      summary: {
        publickKey,
      },
    },
  });

  const status = getTransactionStatus(sender.data, transactions, isMultiSignature, canSenderSignTx);
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
