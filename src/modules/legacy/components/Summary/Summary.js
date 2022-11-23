/* eslint-disable max-statements */
import React, { useMemo } from 'react';
import { withRouter } from 'react-router';
import { tokenMap } from '@token/fungible/consts/tokens';
import { MODULE_COMMANDS_NAME_MAP } from '@transaction/configuration/moduleCommand';
// import useTransactionFeeCalculation from '@transaction/hooks/useTransactionFeeCalculation';
import useTransactionPriority from '@transaction/hooks/useTransactionPriority';
import TransactionSummary from '@transaction/manager/transactionSummary';
// import { toRawLsk } from '@token/fungible/utils/lsk';
import { getFeeStatus } from '@transaction/utils/helpers';
import { splitModuleAndCommand } from 'src/modules/transaction/utils';
import styles from './summary.css';

const Summary = ({ history, balanceReclaimed, nextStep, wallet, t, fees }) => {
  const formProps = {
    moduleCommand: MODULE_COMMANDS_NAME_MAP.reclaim,
  };

  const commandParams = {
    amount: wallet.legacy?.balance,
  };

  const [selectedPriority /* priorityOptions */, ,] = useTransactionPriority();
  const [module, command] = splitModuleAndCommand(formProps.moduleCommand);
  const transactionJSON = useMemo(
    () => ({
      module,
      command,
      fee: 132000, // @TODO: fee value should be gotten from service
      signatures: [],
      nonce: wallet.sequence?.nonce,
      senderPublicKey: wallet.summary?.publicKey,
      params: commandParams,
    }),
    [wallet.legacy?.balance, module, command, wallet.sequence?.nonce, wallet.summary?.publicKey]
  );
  // const { minFee } = useTransactionFeeCalculation({
  //   selectedPriority,
  //   token: tokenMap.LSK.key,
  //   wallet,
  //   priorityOptions,
  //   transactionJSON,
  // });

  // transactionJSON.fee = toRawLsk(minFee.value); // @TODO: this should be reinstated when fee value is to be gotten from service
  formProps.composedFees = {
    Transaction: getFeeStatus({ fee: { value: 0.00132 }, token: tokenMap.LSK.key }),
    // Transaction: getFeeStatus({ fee: minFee, token: tokenMap.LSK.key }), // @TODO: this should be reinstated when fee value is to be gotten from service
    Initialisation: getFeeStatus({ fee: { value: 0.05 }, token: tokenMap.LSK.key }),
  };

  const onSubmit = () => {
    nextStep({
      formProps,
      transactionJSON,
      actionFunction: balanceReclaimed,
    });
  };

  const onConfirmAction = {
    label: t('Continue'),
    onClick: onSubmit,
  };

  const onCancelAction = {
    label: t('Go back'),
    onClick: () => {
      history.goBack();
    },
  };

  return (
    <TransactionSummary
      hasCancel
      hasNoTopCancelButton
      title={t('Transaction Summary')}
      className={styles.container}
      confirmButton={onConfirmAction}
      cancelButton={onCancelAction}
      formProps={formProps}
      transactionJSON={transactionJSON}
      selectedPriority={selectedPriority}
      fees={fees}
    />
  );
};

Summary.whyDidYouRender = true;

// istanbul ignore next
const areEqual = (
  prevProps,
  nextProps // @todo account has multiple balance now
) => prevProps.wallet.summary.balance === nextProps.wallet.summary.balance;

export default withRouter(React.memo(Summary, areEqual));
