import React, { useEffect, useMemo } from 'react';
import { isEmpty } from 'src/utils/helpers';
import { useDispatch } from 'react-redux';
import { useCurrentAccount } from '@account/hooks';
import { useAuth } from '@auth/hooks/queries';
import { fromTransactionJSON, joinModuleAndCommand } from '@transaction/utils';
import actionTypes from '@transaction/store/actionTypes';
import TransactionSummary from '@transaction/manager/transactionSummary';
import useTxInitiatorAccount from '@transaction/hooks/useTxInitiatorAccount';
import { useCommandSchema } from '@network/hooks';
import ProgressBar from '../RegisterMultisigView/ProgressBar';
import styles from './styles.css';

// eslint-disable-next-line max-statements
const Summary = ({
  t,
  prevStep,
  nextStep,
  formProps,
  transactionJSON,
  transactions,
  multisigTransactionSigned,
  authQuery,
}) => {
  const [sender] = useCurrentAccount();
  const dispatch = useDispatch();
  const { txInitiatorAccount } = useTxInitiatorAccount({
    senderPublicKey: transactionJSON.senderPublicKey,
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

  const numberOfSignaturesOnAccount = authQuery.data?.data?.numberOfSignatures;

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
          dispatch({
            type: actionTypes.transactionSigned,
            data: fromTransactionJSON(
              transactionJSON,
              moduleCommandSchemas[joinModuleAndCommand(transactionJSON)]
            ),
          });
          nextStep({
            formProps,
            transactionJSON,
            sender,
            actionFunction,
          });
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
          <h5 className={styles.title}>
            {t(`${numberOfSignaturesOnAccount > 1 ? 'Edit' : 'Register'} multisignature account`)}
          </h5>
        </div>
        <ProgressBar current={2} />
      </TransactionSummary>
    </section>
  );
};

export default Summary;
