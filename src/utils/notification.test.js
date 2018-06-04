import { expect } from 'chai';
import { spy } from 'sinon';
import { fromRawLsk } from './lsk';
import Notification from './notification';

describe('Notification', () => {
  let notify;
  const callbacks = {};

  beforeEach(() => {
    window.ipc = { on: (key, callback) => { callbacks[key] = callback; } };
    notify = Notification.init();
  });

  describe('about(data)', () => {
    const amount = 100000000;
    const mockNotification = spy();

    it('should call this._deposit', () => {
      const spyFn = spy(notify, '_deposit');
      notify.isFocused = false;
      notify.about('deposit', amount);
      expect(spyFn).to.have.been.calledWith(amount);
    });

    it('should call window.Notification', () => {
      window.Notification = mockNotification;
      const msg = `You've received ${fromRawLsk(amount)} LSK.`;

      notify.isFocused = false;
      notify.about('deposit', amount);
      expect(mockNotification).to.have.been.calledWith('LSK received', { body: msg });
      mockNotification.reset();
    });

    it('should not call window.Notification if app is focused', () => {
      notify.isFocused = false;
      callbacks.focus();
      notify.about('deposit', amount);
      expect(mockNotification).to.have.been.not.calledWith();
      mockNotification.reset();
    });

    it('should do nothing if an unhandled notification is supplied', () => {
      callbacks.blur();
      notify.about('unhandled_notification');
      expect(mockNotification).to.have.been.not.calledWith();
      mockNotification.reset();
    });
  });
});
