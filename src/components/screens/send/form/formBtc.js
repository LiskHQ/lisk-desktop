import React from 'react';
import { toRawLsk } from '../../../../utils/lsk';
import FormBase from './formBase';
import TransactionPriority from '../../../shared/transactionPriority';
import useAmountField from './useAmountField';
import useDynamicFeeCalculation from './useDynamicFeeCalculation';
import useProcessingSpeed from './useTransactionPriority';
import useRecipientField from './useRecipientField';

const txType = 'transfer';

const FormBtc = (props) => {
  const {
    token, getInitialValue, account,
  } = props;

  const [transactionPriority, selectTransactionPriority, priorityOptions] = useProcessingSpeed(token);
  const [amount, setAmountField] = useAmountField(getInitialValue('amount'), token);
  const [recipient, setRecipientField] = useRecipientField(getInitialValue('recipient'));
  const [fee, maxAmount] = useDynamicFeeCalculation(transactionPriority, {
    amount: toRawLsk(amount.value), txType, recipient: recipient.value,
  }, token, account);

  const fieldUpdateFunctions = { setAmountField, setRecipientField };
  const fields = {
    amount,
    recipient,
    processingSpeed: transactionPriority,
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
        priorities={priorityOptions}
        selectedPriority={transactionPriority.selectedIndex}
        setSelectedPriority={selectTransactionPriority}
      />
    </FormBase>
  );
};

export default FormBtc;
