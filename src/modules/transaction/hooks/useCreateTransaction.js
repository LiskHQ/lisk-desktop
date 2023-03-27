import { useEffect, useState } from 'react';
import { useCommandParametersSchemas, useNetworkStatus } from '@network/hooks/queries';
import { useAuth } from '@auth/hooks/queries';
import { useCurrentAccount } from '@account/hooks';
import { Transaction } from '../utils/transactions';

export const useCreateTransaction = ({
  module = null,
  command = null,
  encodedTransaction = null,
}) => {
  const { data: networkStatus, isLoading: isNetworkStatusLoading } = useNetworkStatus();
  const [currentAccount] = useCurrentAccount();
  const { pubkey, address } = currentAccount.metadata;
  const { data: auth, isLoading: isAuthLoading } = useAuth({ config: { params: { address } } });
  const { data: commandParametersSchemas, isLoading: isSchemasLoading } =
    useCommandParametersSchemas();
  const [transaction] = useState(new Transaction());

  useEffect(() => {
    if (!isNetworkStatusLoading && !isAuthLoading && !isSchemasLoading) {
      transaction.init({
        pubkey,
        networkStatus: networkStatus.data,
        auth: auth.data,
        commandParametersSchemas: commandParametersSchemas.data,
        module,
        command,
        encodedTransaction,
      });
    }
  }, [transaction, isNetworkStatusLoading, isAuthLoading, isSchemasLoading]);

  return transaction;
};
