import React, { useEffect } from 'react';
import { useCurrentAccount } from '@account/hooks';
import { useAuth } from '@auth/hooks/queries';
import TransactionSummary from '@transaction/manager/transactionSummary';
import { useCommandSchema } from '@network/hooks';
import { isEmpty } from 'src/utils/helpers';
import ProgressBar from '../RegisterMultisigView/ProgressBar';
import styles from './styles.css';

const Summary = ({
  t,
  prevStep,
  nextStep,
  transactions,
  formProps,
  transactionJSON,
  multisigTransactionSigned,
}) => {
  const [sender] = useCurrentAccount();
  const { data: account } = useAuth({
    config: { params: { address: sender.metadata.address } },
  });
  const { moduleCommandSchemas } = useCommandSchema();

  const onConfirmAction = {
    label: t('Sign'),
    onClick: () => {
      multisigTransactionSigned({
        formProps,
        transactionJSON,
        moduleCommandSchemas,
        sender: { ...account.data },
      });
    },
  };

  const onCancelAction = {
    label: t('Go back'),
    onClick: () => {
      prevStep({ formProps, transactionJSON });
    },
  };

  useEffect(() => {
    if (!isEmpty(transactions.signedTransaction)) {
      nextStep({ formProps, transactionJSON, sender });
    }
  }, [transactions.signedTransaction, transactions.txSignatureError]);

  return (
    <section className={styles.wrapper}>
      <TransactionSummary
        hasCancel
        noFeeStatus
        className={styles.container}
        confirmButton={onConfirmAction}
        cancelButton={onCancelAction}
        formProps={formProps}
        transactionJSON={transactionJSON}
      >
        <div className={styles.header}>
          <h1>{t('Register multisignature account')}</h1>
        </div>
        <ProgressBar current={2} />
      </TransactionSummary>
    </section>
  );
};

export default Summary;
