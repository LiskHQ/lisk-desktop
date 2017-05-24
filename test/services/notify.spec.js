const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const expect = chai.expect;
chai.use(sinonChai);

describe('Factory: Notify', () => {
  let lsk;
  let $window;
  let notify;

  beforeEach(angular.mock.module('app'));

  beforeEach(inject((_Notify_, _lsk_, _$window_) => {
    lsk = _lsk_;
    $window = _$window_;
    notify = _Notify_.init();
  }));

  describe('about(data)', () => {
    const amount = 100000000;
    const mockNotification = sinon.spy();

    it('should call this.__deposite', () => {
      const spy = sinon.spy(notify, '__deposite');
      notify.isFocused = false;
      notify.about('deposite', amount);
      expect(spy).to.have.been.calledWith(amount);
    });

    it('should call $window.Notification', () => {
      $window.Notification = mockNotification;
      const msg = `You've received ${lsk.normalize(amount)} LSK.`;

      notify.isFocused = false;
      notify.about('deposite', amount);
      expect(mockNotification).to.have.been.calledWith(
         'LSK received', { body: msg },
      );
      mockNotification.reset();
    });

    it('should not call $window.Notification if app is focused', () => {
      notify.about('deposite', amount);
      expect(mockNotification).to.have.been.not.calledWith();
      mockNotification.reset();
    });

    it('should not call $window.Notification if amount equal 0 or negative', () => {
      notify.isFocused = false;
      notify.about('deposite', 0);
      notify.about('deposite', -1);
      expect(mockNotification.callCount).to.have.been.equal(0);
    });
  });
});
