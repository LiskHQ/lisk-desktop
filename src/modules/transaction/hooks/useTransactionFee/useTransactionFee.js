/* eslint-disable complexity */
// @Todo: this should be fixed in this issue #4521
/* istanbul ignore file */
// import { useCommandSchema } from '@network/hooks/useCommandsSchema';
// import { getParamsSchema } from './utils';
// import usePriorityFee from '../usePriorityFee';
// import { FEE_TYPES } from '../../constants';
// import { joinModuleAndCommand } from '../../utils';
import { useMinimumFee } from '.';

import { FEE_TYPES } from '../../constants';
import { joinModuleAndCommand } from '../../utils';
import { useTransactionEstimateFees } from '../queries';

// const getPriorityValue = (value = '') => {
//   value = value.toLowerCase();
//   return /^normal$/.test(value) ? 'medium' : value;
// };

/**
 *
 * @param {object} data
 * @param {boolean} data.isFormValid Whether the transaction form is valid or not. TxComposer defines this
 * @param {string} data.senderAddress The sender address in Lisk 32 format
 * @param {object} data.transaction Transaction object as Lisk Element expects without fee
 * @returns {object} The fee object with a total value, and a component value as an array of fees
 * that contribute in the total value
 */
// eslint-disable-next-line max-statements
export const useTransactionFee = ({
  isFormValid,
  transactionJSON,
  // selectedPriority = {},
  extraCommandFee = 0,
  senderAddress,
}) => {
  const transactionFee = useTransactionEstimateFees({
    config: { data: { transaction: transactionJSON } },
    options: { enabled: isFormValid && !!transactionJSON },
  });

  const { data: { transaction } = {}, meta = {} } = transactionFee?.data || {};
  // const {
  //   moduleCommandSchemas,
  // } = useCommandSchema();
  // const paramsSchema = getParamsSchema(transactionJSON, moduleCommandSchemas);

  const { result } = useMinimumFee({
    senderAddress,
    isFormValid,
    transactionJSON,
    extraCommandFee,
  });
  console.log('FROM CALC::', transactionJSON, result.value, extraCommandFee);
  // const priorityFee = usePriorityFee({
  //   selectedPriority,
  //   transactionJSON,
  //   paramsSchema,
  //   isEnabled: !!paramsSchema && isFormValid,
  // });
  // const bytesFee = {
  //   value: BigInt(minimumFee.value) - BigInt(extraCommandFee),
  //   type: FEE_TYPES.BYTES_FEE,
  // };
  // const components = [bytesFee, priorityFee].filter((item) => item.value > 0);

  // @todo: remove offset when service is fixed
  const offset = transaction?.fee?.minimum ? 0 : 0;
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

  // console.log(
  //   'FROM API::',
  //   minimumFee,
  //   messageFee,
  //   initializationFee,
  //   priorityFee,
  //   bytesFee,
  //   accountInitializationFee,
  //   components
  // );

  return {
    components,
    minimumFee,
    messageFee,
    isLoading: transactionFee.isLoading,
    isFetched: transactionFee.isFetched,
    transactionFee: (BigInt(minimumFee) + BigInt(priorityFee.value)).toString(),
  };
};
