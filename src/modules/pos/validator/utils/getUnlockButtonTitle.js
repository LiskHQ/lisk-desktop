const getUnlockButtonTitle = (unlockableBalance, t) => {
  if (unlockableBalance === 0) {
    return t('Nothing available to unlock');
  }
  return t('Unlock stakes');
};

export default getUnlockButtonTitle;
