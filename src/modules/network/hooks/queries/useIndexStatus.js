import { INDEX_STATUS } from 'src/const/queries';
import { API_VERSION } from 'src/const/config';
import { useCustomQuery } from 'src/modules/common/hooks';
import { useEffect } from 'react';
import { WEB_SOCKET_EVENTS } from 'src/modules/common/constants';
import { useQueryClient } from '@tanstack/react-query';

export const useIndexStatus = ({ config: customConfig = {}, options, client } = {}) => {
  const config = {
    url: `/api/${API_VERSION}/index/status`,
    method: 'get',
    event: 'get.index.status',
    ...customConfig,
  };

  const queryClient = useQueryClient();

  const query = useCustomQuery({
    keys: [INDEX_STATUS],
    config,
    options,
    client,
  });

  useEffect(() => {
    client.socket?.on(WEB_SOCKET_EVENTS.indexStatus, async (data) => {
      queryClient.setQueriesData({ queryKey: [INDEX_STATUS] }, () => data);
    });

    return () => {
      client.socket?.off(WEB_SOCKET_EVENTS.indexStatus);
    };
  }, []);

  return query;
};
