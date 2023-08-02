import { useCallback, useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { BLOCKS } from 'src/const/queries';
import { LIMIT as limit, API_VERSION } from 'src/const/config';
import { useCustomInfiniteQuery } from 'src/modules/common/hooks';
import client from 'src/utils/api/client';

/**
 * Creates a custom hook for block queries
 *
 * @param {object} configuration - the custom query configuration object
 * @param {Object} configuration.config - the query config
 * @param {Object} configuration.config.params - the query config params
 * @param {number} [configuration.config.params.limit] - the query limit
 * @param {number} [configuration.config.params.offset] - the query offset
 * @param {string} [configuration.config.params.sort] - the query sort
 * @param {string} [configuration.config.params.blockID] - block ID
 * @param {string} [configuration.config.params.height] - block height
 * @param {string} [configuration.config.params.timestamp] - block timestamp
 * @param {string} [configuration.config.params.generatorAddress] - block generator address
 * @param {string} configuration.options - the query options
 *
 * @returns the query object
 */

export const useBlocks = ({ config: customConfig = {}, options } = {}) => {
  const queryClient = useQueryClient();
  const [hasUpdate, setHasUpdate] = useState(false);
  const config = {
    url: `/api/${API_VERSION}/blocks`,
    method: 'get',
    event: 'get.blocks',
    ...customConfig,
    params: { limit, ...(customConfig?.params || {}) },
  };

  useEffect(() => {
    /* istanbul ignore next */
    client.socket?.on('new.block', () => {
      setHasUpdate(true);
    });

    /* istanbul ignore next */
    client.socket?.on('delete.block', () => {
      setHasUpdate(true);
    });
    return () => {
      client.socket?.off('new.block');
      client.socket?.off('delete.block');
    };
  }, []);

  /* istanbul ignore next */
  const invalidateData = useCallback(async () => {
    setHasUpdate(false);
    await queryClient.invalidateQueries(BLOCKS);
  }, [queryClient, setHasUpdate]);

  const response = useCustomInfiniteQuery({
    keys: [BLOCKS],
    config,
    options,
  });

  return {
    ...response,
    hasUpdate,
    addUpdate: invalidateData,
  };
};
