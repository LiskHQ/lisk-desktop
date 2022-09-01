import { useEffect, useState } from 'react';
import { useCommandParametersSchemas, useNetworkStatus } from '@network/hooks/queries';
import { useAuth } from '@auth/hooks/queries';
import { useCurrentAccount } from '@account/hooks';
import { Transaction } from '../utils/transactions';

// eslint-disable-next-line import/prefer-default-export
export const useCreateTransaction = ({
  module,
  command,
}) => {
  const { data: networkStatus, isNetworkStatusLoading } = useNetworkStatus();
  const { data: auth, isAuthLoading } = useAuth();
  const { data: commandParametersSchemas, isSchemasLoading } = useCommandParametersSchemas();
  const [currentAccount] = useCurrentAccount();
  const [transaction] = useState(new Transaction());

  useEffect(() => {
    if (isNetworkStatusLoading && isAuthLoading && isSchemasLoading) {
      transaction.init({
        networkStatus,
        auth,
        commandParametersSchemas,
        module,
        command,
        pubkey: 'fd061b9146691f3c56504be051175d5b76d1b1d0179c5c4370e18534c5882122' || currentAccount.metadata.pubkey,
      });
    }
  }, [isNetworkStatusLoading, isAuthLoading, isSchemasLoading]);

  return transaction;
};
