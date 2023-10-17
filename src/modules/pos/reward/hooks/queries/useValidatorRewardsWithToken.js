import { useCurrentAccount } from '@account/hooks';
import { useEffect, useState } from 'react';
import { useCommandSchema } from '@network/hooks';
import { useAuth } from '@auth/hooks/queries';
import { useAppsMetaTokensConfig } from '@token/fungible/hooks/queries';
import { addTokensMetaData } from '@token/fungible/utils/addTokensMetaData';
import defaultClient from 'src/utils/api/client';
import { isEmpty } from 'src/utils/helpers';
import { splitModuleAndCommand } from '@transaction/utils';
import { MODULE_COMMANDS_NAME_MAP } from '@transaction/configuration/moduleCommand';
import { getRewards } from '@pos/validator/components/StakeForm/StakeForm';

export const useValidatorRewardsWithToken = () => {
  const [
    {
      metadata: { pubkey, address },
    },
  ] = useCurrentAccount();
  const [validatorRewardsWithToken, setValidatorRewardsWithToken] = useState();
  const { moduleCommandSchemas } = useCommandSchema();
  const { data: auth } = useAuth({ config: { params: { address } } });
  const authNounce = auth?.data?.nonce;
  const createMetaConfig = useAppsMetaTokensConfig();
  const transformToken = addTokensMetaData({ createMetaConfig, client: defaultClient });

  useEffect(() => {
    if (isEmpty(moduleCommandSchemas) || !authNounce || !address || !pubkey) {
      return;
    }

    (async () => {
      const [module, command] = splitModuleAndCommand(MODULE_COMMANDS_NAME_MAP.claimRewards);

      const transactionJSON = {
        module,
        command,
        nonce: authNounce,
        fee: 100000000,
        senderPublicKey: pubkey,
        params: {},
        signatures: [],
      };

      const rewardResponse = await getRewards({
        moduleCommandSchemas,
        transactionJSON,
        currentAccountAddress: address,
      });
      const { total, ...validatorHashMap } = rewardResponse?.rewards || {};
      const validators = Object.values(validatorHashMap);

      const validatorsWithTokenData = await transformToken(validators);

      setValidatorRewardsWithToken(validatorsWithTokenData);
    })();
  }, [moduleCommandSchemas, authNounce, address, pubkey]);

  return { validatorRewardsWithToken };
};
