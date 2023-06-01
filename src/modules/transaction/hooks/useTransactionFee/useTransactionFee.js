// @Todo: this should be fixed in this issue #4521
/* istanbul ignore file */
// import { useCommandSchema } from '@network/hooks/useCommandsSchema';
// import { getParamsSchema } from './utils';
// import usePriorityFee from '../usePriorityFee';
// import { FEE_TYPES } from '../../constants';
// import { joinModuleAndCommand } from '../../utils';
// import { useMinimumFee } from '.';
import { FEE_TYPES } from '../../constants';
import { joinModuleAndCommand } from '../../utils';
import { useTransactionEstimateFees } from '../queries';

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
export const useTransactionFee = ({ isFormValid, transactionJSON, selectedPriority = {} }) => {
  const transactionFee = useTransactionEstimateFees({
    config: { data: { transaction: transactionJSON } },
    options: { enabled: isFormValid && !!transactionJSON },
  });

  const { transactionFeeEstimates, dynamicFeeEstimates } = transactionFee?.data?.data || {};
  // const {
  //   moduleCommandSchemas,
  //   isLoading: isSchemaLoading,
  //   isFetched: isSchemaFetched,
  // } = useCommandSchema();
  // const paramsSchema = getParamsSchema(transactionJSON, moduleCommandSchemas);

  // const {
  //   result: minimumFee,
  //   isLoading: isLoadingByteFee,
  //   isFetched: isFetchedByteFee,
  // } = useMinimumFee({
  //   senderAddress,
  //   isFormValid,
  //   transactionJSON,
  //   extraCommandFee,
  // });

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
  let txComponentType = '';
  const moduleCommand = joinModuleAndCommand(transactionJSON);

  if (moduleCommand === 'token:transfer' || moduleCommand === 'token:transferCrossChain') {
    txComponentType = 'Account Initialization';
  } else {
    txComponentType = 'Registration';
  }
  const minimumFee = transactionFeeEstimates?.minFee;
  const extraCommandFee = transactionFeeEstimates?.messageFee?.amount || 0;

  const priorityFee = {
    type: FEE_TYPES.PRIORITY_FEE,
    value: dynamicFeeEstimates[selectedPriority.title] || 0,
  };
  const bytesFee = {
    value: BigInt(minimumFee) - BigInt(extraCommandFee),
    type: FEE_TYPES.BYTES_FEE,
  };
  const components = [bytesFee, priorityFee].filter((item) => item.value > 0);

  console.log('--->>>', txComponentType, minimumFee, extraCommandFee, priorityFee, bytesFee);

  return {
    components:
      extraCommandFee > 0
        ? [...components, { type: txComponentType, value: BigInt(extraCommandFee) }]
        : components,
    isLoading: transactionFee.isLoading,
    isFetched: transactionFee.isFetched,
    transactionFee: (BigInt(minimumFee) + BigInt(priorityFee.value)).toString(),
    minimumFee,
  };
};
