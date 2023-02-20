import { useSelector } from 'react-redux';
import { selectHWAccounts } from '@hardwareWallet/store/selectors/hwSelectors';

const useHWAccounts = () => {
  const hwAccounts = useSelector(selectHWAccounts);
  return { accounts: hwAccounts };
};

export default useHWAccounts;
