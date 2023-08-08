import { useQuery } from '@tanstack/react-query';
import defaultClient from 'src/utils/api/client';
import { useCurrentApplication } from '@blockchainApplication/manage/hooks';

export const useCustomQuery = ({
  keys,
  config = {},
  options = {},
  client = defaultClient,
  queryFn,
}) => {
  const [{ chainID }] = useCurrentApplication();

  return useQuery(
    [...keys, chainID, config],
    async () => (queryFn ? queryFn({ config, client }) : client.call(config)),
    options
  );
};
