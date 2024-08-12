import { useCurrentAccount } from 'src/modules/account/hooks';
import { useCustomQuery } from 'src/modules/common/hooks';
import { LISK_LEGACY_HISTORY } from 'src/const/queries';
import defaultClient from 'src/utils/api/client';

export const useLiskLegacyHistory = ({
  config: customConfig = {},
  options,
  client = defaultClient,
} = {}) => {
  const [currentAccount] = useCurrentAccount();
  const address = customConfig.params?.address || currentAccount.metadata?.address;
  const config = {
    url: `/histories/${address}.csv`,
    method: 'get',
    ...customConfig,
  };

  return useCustomQuery({
    keys: [LISK_LEGACY_HISTORY],
    config,
    options,
    client,
  });
};
