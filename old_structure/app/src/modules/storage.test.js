import { expect } from 'chai';
import { spy } from 'sinon';
import win from './win';
import { readConfig } from './storage';

jest.mock('electron-store');

describe('Storage', () => {
  const winSendSpy = spy(win, 'send');

  afterEach(() => {
    win.eventStack.length = 0;
    winSendSpy.restore();
  });

  describe('readConfig', () => {
    it('should return empty config if storage has no config set', () => {
      // Act
      readConfig();

      // Assert
      expect(winSendSpy).to.have.been.calledWith({ event: 'configRetrieved', value: {} });
    });
  });
});
