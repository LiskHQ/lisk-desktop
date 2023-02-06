import { useSelector } from 'react-redux';
import { selectHWAccounts } from 'src/redux/selectors';

const useHWAccounts = () => {
  const hwAccounts = useSelector(selectHWAccounts);
  return { accounts: hwAccounts };
};

export default useHWAccounts;
