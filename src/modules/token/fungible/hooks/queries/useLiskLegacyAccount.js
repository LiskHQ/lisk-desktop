import { useCurrentAccount } from 'src/modules/account/hooks';
import { useCustomQuery } from 'src/modules/common/hooks';
import { LISK_LEGACY_ACCOUNT } from 'src/const/queries';
import defaultClient from 'src/utils/api/client';

export const useLiskLegacyAccount = ({
  config: customConfig = {},
  options,
  client = defaultClient,
} = {}) => {
  const [currentAccount] = useCurrentAccount();
  const address = customConfig.params?.address || currentAccount.metadata?.address;
  const config = {
    url: `/accounts/${address}.json`,
    method: 'get',
    ...customConfig,
  };

  return useCustomQuery({
    keys: [LISK_LEGACY_ACCOUNT],
    config,
    options,
    client,
  });
};
