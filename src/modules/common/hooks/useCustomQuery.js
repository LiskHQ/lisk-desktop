import { useQuery } from '@tanstack/react-query';
import {
  METHOD,
} from 'src/const/config';
import defaultClient from 'src/utils/api/client';
import { APPLICATION } from 'src/const/queries';
import { useCurrentApplication } from '@blockchainApplication/manage/hooks';

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

export const useCustomQuery = ({
  keys,
  config = {},
  options = {},
  client = defaultClient
}) => {
  const [{ chainID }] = useCurrentApplication();

  return useQuery(
    [...keys, chainID, config],
    async () => client.call(config),
    options,
  );
};
