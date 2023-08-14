/* eslint-disable complexity */
import { MODULE_COMMANDS_NAME_MAP } from '../../configuration/moduleCommand';
import { FEE_TYPES } from '../../constants';
import { joinModuleAndCommand } from '../../utils';
import { useTransactionEstimateFees } from '../queries';

// eslint-disable-next-line max-statements
export const useTransactionFee = ({ isFormValid, transactionJSON, extraCommandFee = 0 }) => {
  let accountInitializationFee = {};
  const { signatures, ...transactionToSendJSON } = transactionJSON;

  transactionToSendJSON.fee = transactionToSendJSON.fee.toString();

  const transactionFee = useTransactionEstimateFees({
    config: { data: { transaction: transactionToSendJSON } },
    options: { enabled: isFormValid && !!transactionJSON },
  });

  const { data: { transaction } = {}, meta = {} } = transactionFee?.data || {};
  const moduleCommand = joinModuleAndCommand(transactionJSON);
  const initializationFee =
    meta.breakdown?.fee?.minimum?.additionalFees?.userAccountInitializationFee || 0;
  const minimumFee = BigInt(transaction?.fee?.minimum || 0);
  const messageFee = BigInt(transaction?.params?.messageFee?.amount || 0);

  if (initializationFee) {
    accountInitializationFee = {
      value: BigInt(initializationFee),
      type: 'Account Initialization',
    };
  }

  const priorityFee = {
    type: FEE_TYPES.PRIORITY_FEE,
    value: 0,
  };
  const bytesFee = {
    value: BigInt(meta.breakdown?.fee?.minimum?.byteFee || 0),
    type: FEE_TYPES.BYTES_FEE,
  };
  let components = [bytesFee, accountInitializationFee, priorityFee].filter(
    (item) => item.value > 0
  );

  if (
    moduleCommand !== MODULE_COMMANDS_NAME_MAP.transfer &&
    moduleCommand !== MODULE_COMMANDS_NAME_MAP.transferCrossChain &&
    extraCommandFee
  ) {
    components = [...components, { type: 'Registration', value: BigInt(extraCommandFee) }];
  }

  return {
    components,
    minimumFee,
    messageFee,
    messageFeeTokenID: transaction?.params?.messageFee?.tokenID,
    isLoading: transactionFee?.isFetching,
    isFetched: transactionFee?.isFetched,
    transactionFee: (BigInt(minimumFee) + BigInt(priorityFee.value)).toString(),
  };
};
