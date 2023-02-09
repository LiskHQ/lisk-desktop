import getGeneratingTime from './getGeneratingTime';

describe('getGeneratingTime', () => {
  it('returns empty result if no time argument is passed', () => {
    const emptyResult = getGeneratingTime();
    expect(emptyResult).toBe('-');
  });

  it('returns now if time difference is less than 9 seconds', () => {
    const recentTime = Math.floor((new Date().getTime() / 1000) - 5);
    const nowResult = getGeneratingTime(recentTime);
    expect(nowResult).toBe('now');
  });

  it('returns time in the past if time difference is more than 9 seconds', () => {
    const recentTime = Math.floor((new Date().getTime() / 1000) - 12);
    const nowResult = getGeneratingTime(recentTime);
    expect(nowResult).toBe('12s ago');
  });

  it('returns future time if generating time is in the future', () => {
    const recentTime = Math.floor((new Date().getTime() / 1000) + 80);
    const nowResult = getGeneratingTime(recentTime);
    expect(nowResult).toBe('in 1m 20s');
  });

  it('returns future time without seconds if generating time is in the future and has no seconds', () => {
    const recentTime = Math.floor((new Date().getTime() / 1000) + 60);
    const nowResult = getGeneratingTime(recentTime);
    expect(nowResult).toBe('in 1m ');
  });
});
