import React from 'react';
import transactionTypes from 'constants';
import { toRawLsk } from '../../../../utils/lsk';
import FormBase from './formBase';
import TransactionPriority from '../../../shared/transactionPriority';
import useAmountField from './useAmountField';
import useTransactionFeeCalculation from './useTransactionFeeCalculation';
import useTransactionPriority from './useTransactionPriority';
import useRecipientField from './useRecipientField';

const txType = transactionTypes().transfer.key;

const FormBtc = (props) => {
  const {
    token, getInitialValue, account,
  } = props;

  const [
    selectedPriority, selectTransactionPriority, priorityOptions,
  ] = useTransactionPriority(token);
  const [amount, setAmountField] = useAmountField(getInitialValue('amount'), token);
  const [recipient, setRecipientField] = useRecipientField(getInitialValue('recipient'));
  const { fee, maxAmount, minFee } = useTransactionFeeCalculation({
    selectedPriority,
    priorityOptions,
    token,
    account,
    txData: {
      amount: toRawLsk(amount.value), txType, recipient: recipient.value,
    },
  });

  const fieldUpdateFunctions = { setAmountField, setRecipientField };
  const fields = {
    amount,
    recipient,
    selectedPriority,
    fee,
  };

  return (
    <FormBase
      {...props}
      fields={fields}
      fieldUpdateFunctions={fieldUpdateFunctions}
      maxAmount={maxAmount}
    >
      <TransactionPriority
        token={token}
        fee={fee}
        minFee={minFee.value}
        priorityOptions={priorityOptions}
        selectedPriority={selectedPriority.selectedIndex}
        setSelectedPriority={selectTransactionPriority}
      />
    </FormBase>
  );
};

export default FormBtc;
