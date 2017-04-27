const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chai = require('chai');

const expect = chai.expect;

chai.use(sinonChai);

describe('main component controller', () => {
  beforeEach(angular.mock.module('app'));

  let $rootScope;
  let $scope;
  let $q;
  let $componentController;
  let controller;
  let account;

  beforeEach(inject((_$componentController_, _$rootScope_, _$q_, _Account_) => {
    $componentController = _$componentController_;
    $rootScope = _$rootScope_;
    $q = _$q_;
    account = _Account_;
  }));

  beforeEach(() => {
    $scope = $rootScope.$new();
    account.set({ passphrase: '' });
    controller = $componentController('main', $scope, {});
  });

  describe('reset()', () => {
    // there's not reset anymore
    it.skip('cancels $timeout', () => {
      const spy = sinon.spy(controller.$timeout, 'cancel');
      controller.reset();
      expect(spy).to.have.been.calledWith(controller.timeout);
    });
  });

  describe('login()', () => {
    let deffered;
    let updateMock;
    let peersMock;

    beforeEach(() => {
      deffered = $q.defer();
      updateMock = sinon.mock(controller);
      updateMock.expects('update').withArgs().returns(deffered.promise);

      peersMock = sinon.mock(controller.$peers);
      peersMock.expects('setActive').withArgs();
    });

    afterEach(() => {
      updateMock.verify();
      updateMock.restore();
    });

    it('sets active peer', () => {
      controller.init();

      deffered.resolve();
      $scope.$apply();
    });

    it('calls this.update() and then sets this.logged = true', () => {
      controller.init();
      deffered.resolve();
      $scope.$apply();

      expect(controller.logged).to.equal(true);
    });

    it('calls this.update() and if that fails and attempts < 10, then sets a timeout to try again', () => {
      const spy = sinon.spy(controller, '$timeout');

      controller.init();
      deffered.reject();
      $scope.$apply();

      expect(spy).to.have.been.calledWith();
    });

    it('calls this.update() and if that fails and attempts >= 10, then show error dialog', () => {
      const spy = sinon.spy(controller.error, 'dialog');

      controller.login(10);
      deffered.reject();
      $scope.$apply();

      expect(spy).to.have.been.calledWith({ text: 'No peer connection' });
    });
  });

  describe('logout()', () => {
    it('resets main component', () => {
      const spy = sinon.spy(controller, 'reset');
      controller.logout();
      expect(spy).to.have.been.calledWith();
    });

    it('resets peers', () => {
      const spy = sinon.spy(controller.$peers, 'reset');
      controller.logout();
      expect(spy).to.have.been.calledWith(true);
    });

    it('sets this.logged = false', () => {
      controller.logout();
      expect(controller.logged).to.equal(false);
    });

    it('sets this.prelogged = false', () => {
      controller.logout();
      expect(controller.prelogged).to.equal(false);
    });

    it('sets this.account = {}', () => {
      controller.logout();
      expect(account.get()).to.deep.equal({});
    });

    it('sets this.passphrase = \'\'', () => {
      controller.logout();
      expect(controller.passphrase).to.equal('');
    });
  });

  describe('checkIfIsDelegate()', () => {
    beforeEach(() => {
      account.set({
        balance: '0',
        passphrase: 'wagon stock borrow episode laundry kitten salute link globe zero feed marble',
      });
    });

    it('calls /api/delegates/get and sets this.isDelegate according to the response.success', () => {
      controller.$peers.active = { sendRequest() {} };
      const activePeerMock = sinon.mock(controller.$peers.active);
      activePeerMock.expects('sendRequest').withArgs('delegates/get').callsArgWith(2, {
        success: true,
      });
      controller.checkIfIsDelegate();
      expect(controller.isDelegate).to.equal(true);
    });
  });

  describe('update()', () => {
    let deffered;

    beforeEach(() => {
      deffered = $q.defer();
      account.set({
        balance: '0',
        passphrase: 'wagon stock borrow episode laundry kitten salute link globe zero feed marble',
      });
      controller.$peers.active = {
        getAccountPromise() {
          return deffered.promise;
        },
        getStatusPromise() {
          return $q.defer().promise;
        },
      };
      controller.address = account.get().address;
      account.reset();
    });

    it('calls this.$peers.active.getAccountPromise(this.address) and then sets result to this.account', () => {
      expect(controller.account).not.to.equal(account.get());
      controller.update();
      deffered.resolve(account.get());
      $scope.$apply();
      expect(controller.account).to.equal(account.get());
    });

    it('calls this.$peers.active.getAccountPromise(this.address) and if it fails, then resets this.account.balance and reject the promise that update() returns', () => {
      const spy = sinon.spy(controller.$q, 'reject');
      controller.update();
      deffered.reject();
      $scope.$apply();
      expect(account.get().balance).to.equal(undefined);
      controller.reset();
      expect(spy).to.have.been.calledWith();
    });
  });
});
