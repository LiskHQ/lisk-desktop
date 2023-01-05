/* eslint-disable max-statements */
import React, { useMemo } from 'react';
import { withRouter } from 'react-router';
import { useTokensBalance } from '@token/fungible/hooks/queries';
import { MODULE_COMMANDS_NAME_MAP } from '@transaction/configuration/moduleCommand';
import useTransactionFeeCalculation from '@transaction/hooks/useTransactionFeeCalculation';
import useTransactionPriority from '@transaction/hooks/useTransactionPriority';
import TransactionSummary from '@transaction/manager/transactionSummary';
import { toRawLsk } from '@token/fungible/utils/lsk';
import { splitModuleAndCommand } from 'src/modules/transaction/utils';
import { parseSearchParams } from 'src/utils/searchParams';
import styles from './summary.css';

const Summary = ({ history, balanceReclaimed, nextStep, wallet, t, fees }) => {
  const formProps = {
    moduleCommand: MODULE_COMMANDS_NAME_MAP.reclaim,
  };

  const commandParams = {
    amount: wallet.legacy?.balance,
  };
  const { tokenID } = parseSearchParams(history.location.search);

  const { data: tokens } = useTokensBalance({ config: { params: { tokenID } } });
  const token = useMemo(() => tokens?.data?.[0] || {}, [tokens]);

  const [selectedPriority,, priorityOptions] = useTransactionPriority();
  const [module, command] = splitModuleAndCommand(formProps.moduleCommand);
  const transactionJSON = useMemo(
    () => ({
      id: '',
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

  const { minFee } = useTransactionFeeCalculation({
    selectedPriority,
    priorityOptions,
    token,
    wallet,
    transactionJSON,
  });

  const accountInitializationFee = 0.04; // @TODO: https://github.com/LiskHQ/lisk-sdk/blob/f732135e90cd2f1ba1fd46dad045041e289f8763/framework/src/modules/token/constants.ts#L35
  transactionJSON.fee = toRawLsk(+minFee.value + accountInitializationFee);

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

Summary.whyDidYouRender = true;

// istanbul ignore next
const areEqual = (
  prevProps,
  nextProps // @todo account has multiple balance now
) => prevProps.wallet.summary.balance === nextProps.wallet.summary.balance;

export default withRouter(React.memo(Summary, areEqual));
