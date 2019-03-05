import { setWalletsInLocalStorage } from '../../utils/wallets';

const walletsSubscriber = (store) => {
  const { wallets } = store.getState();
  setWalletsInLocalStorage(wallets);
};

export default walletsSubscriber;
