import { fromRawLsk } from '@token/fungible/utils/lsk';

const getUnlockButtonTitle = (unlockableBalance, token, t) => {
  if (unlockableBalance === 0) {
    return t('Nothing available to unlock');
  }
  return `${t('Unlock')} ${fromRawLsk(unlockableBalance)} ${token}`;
};

export default getUnlockButtonTitle;
