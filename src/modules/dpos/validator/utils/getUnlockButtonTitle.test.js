import getUnlockButtonTitle from './getUnlockButtonTitle';

describe('getUnlockButtonTitle', () => {
  const t = str => str;

  it('Returns a message if nothing to unlock', () => {
    const unlockableBalance = 0;
    const token = 'LSK';
    expect(getUnlockButtonTitle(unlockableBalance, token, t)).toEqual('Nothing available to unlock');
  });

  it('Returns a message if nothing to unlock', () => {
    const unlockableBalance = 100000000;
    const token = 'LSK';
    expect(getUnlockButtonTitle(unlockableBalance, token, t)).toEqual('Unlock 1 LSK');
  });
});
