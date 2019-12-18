import { parseSearchParams } from '../../../../../utils/searchParams';
import useAmountField from './useAmountField';
import useRecipientField from './useRecipientField';

const useCommonFields = (prevState, history, getMaxAmount) => {
  const searchParams = parseSearchParams(history.location.search);
  const initialValues = {
    amount: (prevState.fields && prevState.fields.amount.value) || searchParams.amount || '',
    recipient: (prevState.fields && prevState.fields.recipient.value) || searchParams.recipient || '',
  };

  const [amount, setAmountField] = useAmountField(initialValues.amount, getMaxAmount);
  const [recipient, setRecipientField] = useRecipientField(initialValues.recipient);

  return {
    fields: { amount, recipient },
    fieldUpdateFunctions: { setAmountField, setRecipientField },
  };
};
export default useCommonFields;
