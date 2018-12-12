import { expect } from 'chai';
import piwik from './piwik';
import localJSONStorage from './localJSONStorage';

describe('Piwik tracking', () => {
  const history = {
    path: '',
    location: {},
  };

  it('connect to router history to piwik, with Tracking Mode DISABLED', () => {
    const newPiwik = piwik.connectPiwikWithHistory(history);
    expect(newPiwik).to.be.equal(false);
  });

  it('connect to router history to piwik, with Tracking Mode ENABLED', () => {
    localJSONStorage.set('statistics', true);
    const newPiwik = piwik.connectPiwikWithHistory(history);
    expect(newPiwik).to.not.equal(false);
  });
});
