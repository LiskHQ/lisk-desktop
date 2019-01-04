import { expect } from 'chai';
import ReactPiwik from 'react-piwik';
import piwik from './piwik';

describe('Piwik tracking', () => {
  const history = {
    path: '',
    location: {},
  };

  afterEach(() => {
    ReactPiwik.prototype.connectToHistory.reset();
  });

  it('connect to router history to piwik, with Tracking Mode DISABLED', () => {
    piwik.tracking(history, { statistics: false });
    expect(ReactPiwik.prototype.connectToHistory).to.not.be.calledWith(history);
  });

  it('connect to router history to piwik, with Tracking Mode ENABLED', () => {
    piwik.tracking(history, { statistics: false });
    expect(ReactPiwik.prototype.connectToHistory).to.not.be.calledWith(history);
    piwik.tracking(history, { statistics: true });
    expect(ReactPiwik.prototype.connectToHistory).to.be.calledWith(history);
  });

  it('connect to router history to piwik, with Tracking Mode ENABLED then DISABLED', () => {
    piwik.tracking(history, { statistics: true });
    expect(ReactPiwik.prototype.connectToHistory).to.be.calledWith(history);
    ReactPiwik.prototype.connectToHistory.reset();
    piwik.tracking(history, { statistics: false });
    expect(ReactPiwik.prototype.connectToHistory).to.not.be.calledWith(history);
  });
});
