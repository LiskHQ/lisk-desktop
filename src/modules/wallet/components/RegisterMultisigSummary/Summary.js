import React, { useEffect, useMemo } from 'react';
import { isEmpty } from 'src/utils/helpers';
import { useCurrentAccount } from '@account/hooks';
import { useAuth } from '@auth/hooks/queries';
import TransactionSummary from '@transaction/manager/transactionSummary';
import useTxInitiatorAccount from '@transaction/hooks/useTxInitiatorAccount';
import { useCommandSchema } from '@network/hooks';
import ProgressBar from '../RegisterMultisigView/ProgressBar';
import styles from './styles.css';

const Summary = ({
  t,
  prevStep,
  nextStep,
  formProps,
  transactionJSON,
  transactions,
  multisigTransactionSigned,
}) => {
  const [sender] = useCurrentAccount();
  const { txInitiatorAccount } = useTxInitiatorAccount({
    transactionJSON,
  });
  const { data: account } = useAuth({
    config: { params: { address: sender.metadata.address } },
  });
  const { moduleCommandSchemas, messagesSchemas } = useCommandSchema();
  const isSenderMember = useMemo(
    () =>
      [...transactionJSON.params.mandatoryKeys, ...transactionJSON.params.optionalKeys].includes(
        sender.metadata.pubkey
      ),
    [transactionJSON]
  );

  const onConfirmAction = useMemo(
    () => ({
      label: t('Sign'),
      className: styles.actionBtn,
      onClick: () => {
        const actionFunction = (form, _, privateKey) =>
          multisigTransactionSigned({
            formProps,
            transactionJSON,
            privateKey,
            moduleCommandSchemas,
            txInitiatorAccount,
            sender: { ...account.data },
            messagesSchemas,
          });

        if (!isSenderMember) {
          actionFunction();
        } else {
          nextStep({
            formProps,
            transactionJSON,
            sender,
            actionFunction,
          });
        }
      },
    }),
    [isSenderMember, formProps, transactionJSON, moduleCommandSchemas, account]
  );

  const onCancelAction = {
    label: t('Edit'),
    className: styles.actionBtn,
    onClick: () => {
      prevStep({ formProps, transactionJSON });
    },
  };

  useEffect(() => {
    if (!isEmpty(transactions.signedTransaction) && !isSenderMember) {
      nextStep({ formProps, transactionJSON, sender }, 2);
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
          <h5 className={styles.title}>{t('Register multisignature account')}</h5>
        </div>
        <ProgressBar current={2} />
      </TransactionSummary>
    </section>
  );
};

export default Summary;
