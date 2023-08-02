import { useCallback, useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { BLOCKS } from 'src/const/queries';
import { LIMIT as limit, API_VERSION } from 'src/const/config';
import { useCustomInfiniteQuery } from 'src/modules/common/hooks';
import client from 'src/utils/api/client';

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
