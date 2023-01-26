/* eslint-disable complexity */
/* eslint-disable max-statements */
import { useMemo } from 'react';
import { useAuth, useGetInitializationFees } from '@auth/hooks/queries';
import { useTokensBalance } from '@token/fungible/hooks/queries';
import { usePosConstants } from '@pos/validator/hooks/queries';
import { FEE_TYPES } from '../../constants';
import { MODULE_COMMANDS_MAP } from '../../configuration/moduleCommand';
import { joinModuleAndCommand } from '../../utils';

// const ZERO_FEE = { commandFee: 0, initFee: 0, initCCMFee: 0 };

export const useCommandFee = (transaction) => {
  const address = transaction?.params?.recipientAddress;
  const queryConfig = {
    options: { enabled: !!address },
    config: { params: { address } },
  };
  const { data: auth, isLoading: isAuthLoading } = useAuth(queryConfig);
  const { data: token, isLoading: isTokenLoading } = useTokensBalance(queryConfig);
  const { data: posConstants, isLoading: isPosConstantsLosing } = usePosConstants();
  const { data: initializationFees, isLoading: isInitializationFeesLoading } =
    useGetInitializationFees();

  const fees = useMemo(
    () => {
      // Return Zero fees if data is not ready
      if (
        !address ||
        isTokenLoading ||
        isAuthLoading ||
        isPosConstantsLosing ||
        isInitializationFeesLoading
      ) {
        return [];
      }

      // Define criteria
      const isInitialized = auth?.data?.nonce !== '0' || token?.data?.balances?.length;
      const isSameChain = transaction.params.receivingChainID === transaction.params.chainID;
      const isRegisterValidator =
        joinModuleAndCommand(transaction) === MODULE_COMMANDS_MAP.REGISTER_VALIDATOR;

      // Check and return values
      return [
        {
          value: isSameChain && !isInitialized ? initializationFees.result.data.userAccount : 0,
          type: FEE_TYPES.INITIALIZATION,
        },
        {
          value: !isSameChain && !isInitialized ? initializationFees.result.data.escrowAccount : 0,
          type: FEE_TYPES.ESCROW_INITIALIZATION,
        },
        {
          value: isRegisterValidator
            ? posConstants.data.extraCommandFees.validatorRegistrationFee
            : 0,
          type: FEE_TYPES.REGISTER_VALIDATOR,
        },
      ];
    }, [auth, token, transaction, posConstants, initializationFees]
  );

  return fees;
};
