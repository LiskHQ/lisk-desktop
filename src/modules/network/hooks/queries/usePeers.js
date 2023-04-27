import { PEERS } from 'src/const/queries';
import { API_VERSION, LIMIT as limit } from 'src/const/config';
import { useCustomInfiniteQuery } from 'src/modules/common/hooks';

/**
 * Creates a custom hook for peers list queries
 *
 * @param {object} configuration - the custom query configuration object
 * @param {object} configuration.config - the query config
 * @param {object} configuration.config.params - the query config params
 * @param {number} [configuration.config.params.limit] - the query limit
 * @param {number} [configuration.config.params.offset] - the query offset
 * @param {string} [configuration.config.params.sort] - the query sort
 * @param {string} [configuration.config.params.height] - filter peers by a given height
 * @param {string} [configuration.config.params.state] - filter peers by connection status
 * @param {string} [configuration.config.params.networkVersion] - filter peers by network version
 * @param {string} [configuration.config.params.ip] -filter peers by the peer's ip address
 *
 * @returns the query object
 */

export const usePeers = ({ config: customConfig = {}, options } = {}) => {
  const config = {
    url: `/api/${API_VERSION}/network/peers`,
    event: 'get.peers',
    method: 'get',
    ...customConfig,
    params: { limit, ...customConfig.params },
  };

  return useCustomInfiniteQuery({
    keys: [PEERS],
    config,
    options,
  });
};
