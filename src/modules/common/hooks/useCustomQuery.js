import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import {
  METHOD,
} from 'src/const/config';
import defaultClient from 'src/utils/api/client';
import { APPLICATION } from 'src/const/queries';
import { useCurrentApplication } from '@blockchainApplication/manage/hooks';
import { getNetworkName } from 'src/modules/network/utils/getNetwork';

/**
 * Creates a custom hook for inifinite queries
 *
 * @param {object} configuration - the custom query configuration object
 * @param {string[]} configuration.keys - the query keys
 * @param {object} configuration.config - the query config
 * @param {object} configuration.config.params - the query config params
 * @param {number} [configuration.config.params.limit] - the query limit
 * @param {number} [configuration.config.params.offset] - the query offset
 * @param {string} [configuration.config.params.sort] - the query sort
 * @param {string} configuration.options - the query options
 *
 * @returns the query object
 */
// eslint-disable-next-line import/prefer-default-export
export const useCustomQuery = ({
  keys,
  config = {},
  options = {},
  client = defaultClient
}) => {
  const [{ chainID }] = useCurrentApplication();
  const network = useSelector(state => state.network);
  const networkName = getNetworkName(network)

  const axiosConfig = {
    ...config,
    params: { ...config.params, network: networkName }
  }

  return useQuery(
    [chainID, axiosConfig, APPLICATION, METHOD, ...keys],
    async () => client[METHOD](axiosConfig),
    options,
  );
};
