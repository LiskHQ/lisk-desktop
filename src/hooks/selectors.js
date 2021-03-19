import { useSelector } from 'react-redux';
import {
  selectAccount, selectActiveToken, selectBookmarks, selectSettings, selectTransactions,
} from '../store/selectors';

const useSettings = useSelector(selectSettings);
const useTransactions = useSelector(selectTransactions);
const useAccount = useSelector(selectAccount);
const useBookmarks = useSelector(selectBookmarks);
const useActiveToken = useSelector(selectActiveToken);

export {
  useActiveToken,
  useSettings,
  useTransactions,
  useAccount,
  useBookmarks,
};
