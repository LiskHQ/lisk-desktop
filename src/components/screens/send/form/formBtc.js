import React from 'react';
import { toRawLsk } from '../../../../utils/lsk';
import FormBase from './formBase';
import DynamicFee from '../../../shared/dynamicFee';
import useAmountField from './useAmountField';
import useDynamicFeeCalculation from './useDynamicFeeCalculation';
import useProcessingSpeed from './useProcessingSpeed';
import useRecipientField from './useRecipientField';

const txType = 'transfer';

const FormBtc = (props) => {
  const {
    token, getInitialValue, account,
  } = props;

  const [processingSpeed, selectProcessingSpeed, feeOptions] = useProcessingSpeed(token);
  const [amount, setAmountField] = useAmountField(getInitialValue('amount'), token);

  const [recipient, setRecipientField] = useRecipientField(getInitialValue('recipient'));
  const [fee, maxAmount] = useDynamicFeeCalculation(processingSpeed, {
    amount: toRawLsk(amount.value), txType, recipient: recipient.value,
  }, token, account);

  const fieldUpdateFunctions = { setAmountField, setRecipientField };
  const fields = {
    amount,
    recipient,
    processingSpeed,
    fee,
  };

  return (
    <FormBase
      {...props}
      fields={fields}
      fieldUpdateFunctions={fieldUpdateFunctions}
      maxAmount={maxAmount}
    >
      <DynamicFee
        token={token}
        fee={fee}
        priorities={feeOptions}
        selectedPriority={processingSpeed.selectedIndex}
        setSelectedPriority={selectProcessingSpeed}
      />
    </FormBase>
  );
};

export default FormBtc;
