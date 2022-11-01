import { METHOD } from 'src/const/config';
import { useCurrentApplication } from 'src/modules/blockchainApplication/manage/hooks';

export function useQueryKeys(keys) {
  const [{ chainID }] = useCurrentApplication();

  return [...keys, chainID, METHOD];
}
