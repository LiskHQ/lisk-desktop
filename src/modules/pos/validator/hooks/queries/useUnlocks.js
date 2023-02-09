/* istanbul ignore file */
import { UNLOCKS } from 'src/const/queries';
import { API_VERSION } from 'src/const/config';
import { useCustomInfiniteQuery } from 'src/modules/common/hooks';
import { usePosConstants } from '@pos/validator/hooks/queries/usePosConstants';

/**
 * Creates a custom hook for stakes unlocks queries
 *
 * @param {object} configuration - the custom query configuration object
 * @param {object} configuration.config - the query config
 * @param {object} configuration.config.params - the query config params
 * @param {number} [configuration.config.params.limit] - the query limit
 * @param {number} [configuration.config.params.offset] - the query offset
 * @param {string} [configuration.config.params.address] - account address
 * @param {string} [configuration.config.params.publicKey] - account public key
 * @param {string} [configuration.config.params.name] - account name
 * @param {string} configuration.options - the query options
 *
 * @returns the query object
 */

export const useUnlocks = ({ config: customConfig = {}, options } = {}) => {
  const { data: posConstants, isSuccess } = usePosConstants();
  const maxNumberPendingUnlocks = posConstants?.data?.maxNumberPendingUnlocks;

  const hasRequiredParams =
    customConfig.params?.address || customConfig.params?.name || customConfig.params?.publicKey;

  const config = {
    url: `/api/${API_VERSION}/pos/unlocks`,
    method: 'get',
    event: 'get.pos.unlocks',
    ...customConfig,
    params: { limit: maxNumberPendingUnlocks, ...(customConfig.params || {}) },
  };
  const customOptions = {
    ...options,
    enabled: !!hasRequiredParams && isSuccess,
    select: (data) =>
      data.pages.reduce((prevPages, page) => {
        const newData = page?.data || {};
        const newUnlocks = page?.data.pendingUnlocks || [];
        return {
          ...page,
          data: {
            ...newData,
            pendingUnlocks: prevPages.data
              ? [...prevPages.data.pendingUnlocks, ...newUnlocks]
              : newUnlocks,
          },
        };
      }),
  };
  return useCustomInfiniteQuery({
    keys: [UNLOCKS],
    options: customOptions,
    config,
  });
};
