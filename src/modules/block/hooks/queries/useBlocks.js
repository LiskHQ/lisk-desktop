/* istanbul ignore file */
import { useCurrentApplication } from '@blockchainApplication/manage/hooks';
import { BLOCKS, APPLICATION } from 'src/const/queries';
import {
  METHOD,
  LIMIT as limit,
  API_VERSION,
} from 'src/const/config';
import { useCustomInfiniteQuery } from 'src/modules/common/hooks/queries';

// eslint-disable-next-line import/prefer-default-export
export const useBlocks = ({ config: customConfig = {}, options } = { }) => {
  const [currentApplication] = useCurrentApplication();
  const config = {
    baseURL: currentApplication?.apis[0][METHOD] ?? currentApplication?.apis[0].rest,
    path: `/api/${API_VERSION}/blocks`,
    event: 'get.blocks',
    ...customConfig,
    params: { limit, ...customConfig.params },
  };

  const keys = [BLOCKS, APPLICATION, METHOD, config];

  return useCustomInfiniteQuery({ config, options, keys });
};
