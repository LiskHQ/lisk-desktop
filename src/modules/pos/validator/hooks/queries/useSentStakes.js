/* istanbul ignore file */
import { STAKES_SENT } from 'src/const/queries';
import { API_VERSION } from 'src/const/config';
import { useCustomQuery } from 'src/modules/common/hooks';
import defaultClient from 'src/utils/api/client';

/**
 * Creates a custom hook for stakes sent queries
 *
 * @param {object} configuration - the custom query configuration object
 * @param {object} configuration.config - the query config
 * @param {object} configuration.config.params - the query config params
 * @param {string} [configuration.config.params.address] - account address
 * @param {string} [configuration.config.params.name] - account name
 * @param {string} [configuration.config.params.publicKey] - account public key
 * @param {string} configuration.options - the query options
 *
 * @returns the query object
 */

export const useSentStakes = ({ config: customConfig = {}, options } = {}) => {
  const config = {
    url: `/api/${API_VERSION}/pos/stakes`,
    method: 'get',
    event: 'get.pos.stakes',
    ...customConfig,
  };

  console.log('11 useSentStakes config', config);

  return useCustomQuery({
    keys: [STAKES_SENT],
    options,
    config,
  });
};

export const addValidatorToStakes =
  ({ config, client }) =>
  async (tokens) => {
    console.log('useSentStakesWithValidators addMe');
    try {
      const metaRes = await client.call(config);
      return metaRes;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('meta tokens Error:', e);
      return tokens;
    }
  };

const validatorConfig = {
  url: `/api/${API_VERSION}/pos/validators`,
  method: 'get',
  event: 'get.pos.validators',
  params: { address: 'lskhbxua8tpdckcewntcttfqfo4rbatampo2dgrno1' },
};

export const useSentStakesWithValidators = ({ config: customConfig = {}, options } = {}) => {
  const transformStakes = addValidatorToStakes({
    config: validatorConfig,
    client: defaultClient,
  });

  const transformResult = async (res) => {
    console.log('useSentStakesWithValidators res', res);
    const validator = await transformStakes(res.data);
    console.log('useSentStakesWithValidators validator', validator);
    return {
      ...res,
      data: validator,
    };
  };
  console.log('useSentStakesWithValidators customConfig', customConfig);

  const ok = async () => {
    console.log('useSentStakesWithValidators ok.....');
  };

  const config = {
    ...customConfig,
    transformResult: ok,
  };

  console.log('useSentStakesWithValidators config', config);

  return useSentStakes({
    config,
    options,
  });
};
