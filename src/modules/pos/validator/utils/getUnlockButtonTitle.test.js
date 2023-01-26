import getUnlockButtonTitle from './getUnlockButtonTitle';

describe('getUnlockButtonTitle', () => {
  const t = str => str;

  it('Should show "Nothing available to unlock" if there is an unlockableBalance', () => {
    const unlockableBalance = 0;
    expect(getUnlockButtonTitle(unlockableBalance, t)).toEqual('Nothing available to unlock');
  });

  it('Should show "Unlock stakes" if there is an unlockableBalance', () => {
    const unlockableBalance = 100000000;
    expect(getUnlockButtonTitle(unlockableBalance, t)).toEqual('Unlock stakes');
  });
});
