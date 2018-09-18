import { expect } from 'chai';
import { stub } from 'sinon';
import {
  getSettingsFromLocalStorage,
  setSettingsInLocalStorage,
} from './settings';

describe('settings', () => {
  const settingsObject = {
    currency: 'USD',
    autoLogout: true,
  };

  beforeEach(() => {
    stub(localStorage, 'getItem');
    stub(localStorage, 'setItem');
  });

  afterEach(() => {
    localStorage.getItem.restore();
    localStorage.setItem.restore();
  });

  describe('getSettingsFromLocalStorage', () => {
    it('returns {} if if localStorage.getItem(\'settings\') returns undefined', () => {
      expect(getSettingsFromLocalStorage()).to.deep.equal({});
    });

    it('returns {} if if localStorage.getItem(\'settings\') returns invalid JSON string', () => {
      localStorage.getItem.returns('{]');
      expect(getSettingsFromLocalStorage()).to.deep.equal({});
      localStorage.getItem.returns('{}');
      expect(getSettingsFromLocalStorage()).to.deep.equal({});
    });

    it('returns array parsed from json in localStorage.getItem(\'settings\')', () => {
      localStorage.getItem.returns(JSON.stringify(settingsObject));
      expect(getSettingsFromLocalStorage()).to.deep.equal(settingsObject);
    });
  });

  describe('setSettingsInLocalStorage', () => {
    it('sets settings in localStorage and also returns it', () => {
      setSettingsInLocalStorage(settingsObject);
      expect(localStorage.setItem).to.have.been.calledWith('settings', JSON.stringify(settingsObject));
    });
  });
});
