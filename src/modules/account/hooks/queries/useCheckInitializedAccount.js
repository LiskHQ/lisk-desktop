import { useCustomQuery } from '@common/hooks';
import { INITIALIZED_ACCOUNTS } from 'src/const/queries';
import { getCheckInitializedAccount } from '../../utils/getTokenBalances';

const useCheckInitializedAccount = ({ config, options } = {}) =>
  useCustomQuery({
    keys: [INITIALIZED_ACCOUNTS],
    config,
    options,
    queryFn: getCheckInitializedAccount,
  });

export default useCheckInitializedAccount;
