import { getAccountsList } from 'src/modules/wallet/utils/hwManager';

const useHWAccounts = () => {
  // TODO: Refactor when hwManager is refactored to a class
  // const hwManager = new HWManager();
  const accountList = getAccountsList();
  return accountList;
};

export default useHWAccounts;
