import { sortByVersion } from './index';

describe('sortByVersion', () => {
  it('sorts versions based on major, minor and patch release values', () => {
    [
      ['1.0.0', '0.9.9'],
      ['1.1.0', '1.0.2'],
      ['1.1.2', '1.1.1'],
      ['1.2.3', '1.2.3-rc.0'],
      ['1.2.3', '1.2.3-beta.0'],
      ['1.2.3-rc.0', '1.2.3-beta.0'],
      ['1.2.3-beta.1', '1.2.3-beta.0'],
      ['1.2.3-rc.1', '1.2.3-rc.0'],
    ].map(versions =>
      expect(sortByVersion(
        { networkVersion: versions[0] },
        { networkVersion: versions[1] },
      )).toEqual(-1));
  });
});
