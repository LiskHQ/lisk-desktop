/* eslint-disable max-statements */
import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { MODULE_COMMANDS_NAME_MAP } from '@transaction/configuration/moduleCommand';
import { useTransactionFee } from '@transaction/hooks/useTransactionFee/useTransactionFee';
import useTransactionPriority from '@transaction/hooks/useTransactionPriority';
import TransactionSummary from '@transaction/manager/transactionSummary';
import { splitModuleAndCommand } from 'src/modules/transaction/utils';
import styles from './summary.css';

const Summary = ({ balanceReclaimed, nextStep, wallet, t, fees }) => {
  const history = useHistory();
  const formProps = {
    moduleCommand: MODULE_COMMANDS_NAME_MAP.reclaimLSK,
  };

  const commandParams = {
    amount: wallet.legacy?.balance,
  };

  const [selectedPriority] = useTransactionPriority();
  const [module, command] = splitModuleAndCommand(formProps.moduleCommand);
  const transactionJSON = useMemo(
    () => ({
      module,
      command,
      fee: 0,
      signatures: [],
      nonce: wallet.sequence?.nonce,
      senderPublicKey: wallet.summary?.publicKey,
      params: commandParams,
    }),
    [wallet.legacy?.balance, module, command, wallet.sequence?.nonce, wallet.summary?.publicKey]
  );

  const { transactionFee, isFetched } = useTransactionFee({
    transactionJSON,
    selectedPriority,
    isFormValid: true,
    senderAddress: wallet.summary?.address,
  });
  transactionJSON.fee = transactionFee;

  const onSubmit = () => {
    nextStep({
      formProps,
      transactionJSON,
      actionFunction: balanceReclaimed,
    });
  };

  const onConfirmAction = {
    label: t('Confirm and send'),
    className: styles.actionBtn,
    onClick: onSubmit,
    disabled: !isFetched,
  };

  const onCancelAction = {
    label: t('Go back'),
    onClick: () => {
      history.goBack();
    },
  };

  return (
    <TransactionSummary
      noFeeStatus
      title={t('Transaction Summary')}
      className={styles.container}
      confirmButton={onConfirmAction}
      cancelButton={onCancelAction}
      formProps={formProps}
      transactionJSON={transactionJSON}
      selectedPriority={{ value: 'low' }}
      fees={fees}
    />
  );
};

export default Summary;
