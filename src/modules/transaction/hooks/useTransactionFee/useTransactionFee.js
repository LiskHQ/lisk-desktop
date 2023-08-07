/* eslint-disable complexity */
import { FEE_TYPES } from '../../constants';
import { joinModuleAndCommand } from '../../utils';
import { useTransactionEstimateFees } from '../queries';

// eslint-disable-next-line max-statements
export const useTransactionFee = ({ isFormValid, transactionJSON, extraCommandFee = 0 }) => {
  const transactionFee = useTransactionEstimateFees({
    config: { data: { transaction: transactionJSON } },
    options: { enabled: isFormValid && !!transactionJSON },
  });

  const { data: { transaction } = {}, meta = {} } = transactionFee?.data || {};

  // @todo: remove offset when service is fixed
  const offset = transaction?.fee?.minimum ? 68000 : 0;
  const moduleCommand = joinModuleAndCommand(transactionJSON);
  let accountInitializationFee = {};

  const initializationFee =
    meta.breakdown?.fee?.minimum?.additionalFees?.userAccountInitializationFee || 0;
  const minimumFee = BigInt(transaction?.fee?.minimum || 0) + BigInt(offset);
  const messageFee = BigInt(0);

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
    moduleCommand !== 'token:transfer' &&
    moduleCommand !== 'token:transferCrossChain' &&
    extraCommandFee
  ) {
    components = [...components, { type: 'Registration', value: BigInt(extraCommandFee) }];
  }

  return {
    components,
    minimumFee,
    messageFee,
    isLoading: transactionFee.isFetching,
    isFetched: transactionFee.isFetched,
    transactionFee: (BigInt(minimumFee) + BigInt(priorityFee.value)).toString(),
  };
};
