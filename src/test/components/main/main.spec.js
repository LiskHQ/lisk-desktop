const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chai = require('chai');

const expect = chai.expect;

const delegateAccount = {
  passphrase: 'recipe bomb asset salon coil symbol tiger engine assist pact pumpkin visit',
  address: '537318935439898807L',
};

chai.use(sinonChai);

describe('main component controller', () => {
  beforeEach(angular.mock.module('app'));

  let $rootScope;
  let $scope;
  let $q;
  let $componentController;
  let controller;
  let account;
  let peers;
  let accountApi;
  let delegateService;

  beforeEach(inject((_$componentController_, _$rootScope_, _Peers_,
    _$q_, _Account_, _AccountApi_, _delegateService_) => {
    $componentController = _$componentController_;
    $rootScope = _$rootScope_;
    $q = _$q_;
    account = _Account_;
    accountApi = _AccountApi_;
    delegateService = _delegateService_;
    peers = _Peers_;
  }));

  beforeEach(() => {
    $scope = $rootScope.$new();
    account.set({ passphrase: delegateAccount.passphrase });
    peers.setActive({
      name: 'Mainnet',
    });
    controller = $componentController('main', $scope, {});
  });

  describe('init()', () => {
    let deffered;
    let updateMock;
    let peersMock;

    beforeEach(() => {
      deffered = $q.defer();
      updateMock = sinon.mock(controller);
      updateMock.expects('update').withArgs().returns(deffered.promise);

      peersMock = sinon.mock(controller.peers);
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

      expect($rootScope.logged).to.equal(true);
    });

    it('calls this.update() and if that fails and attempts < 10, then sets a timeout to try again', () => {
      const spy = sinon.spy(controller, '$timeout');

      controller.init();
      deffered.reject();
      $scope.$apply();

      expect(spy).to.have.been.calledWith();
    });

    it('calls this.update() and if that fails and attempts >= 10, then show error alert dialog', () => {
      const spy = sinon.spy(controller.dialog, 'errorAlert');

      controller.init(10);
      deffered.reject();
      $scope.$apply();

      expect(spy).to.have.been.calledWith({ text: 'No peer connection' });
    });
  });

  describe('checkIfIsDelegate()', () => {
    beforeEach(() => {
      account.set({
        balance: '0',
        passphrase: 'wagon stock borrow episode laundry kitten salute link globe zero feed marble',
      });
    });

    it.skip('calls /api/delegates/get and sets account.isDelegate according to the response.success', () => {
      delegateService.registerDelegate();
      controller.checkIfIsDelegate();
      expect(account.get().isDelegate).to.equal(true);
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
      const mock = sinon.mock(accountApi);
      mock.expects('get').returns(deffered.promise);
      controller.Peers = {
        getStatusPromise() {
          return $q.defer().promise;
        },
      };
      controller.address = account.get().address;
      account.reset();
    });

    it('calls this.accountApi.get(this.address) and then sets balance', () => {
      expect(account.get().balance).to.equal(undefined);
      controller.update();
      deffered.resolve({ balance: 12345 });
      $scope.$apply();
      expect(account.get().balance).to.equal(12345);
    });

    it('calls this.accountApi.get(this.address) and if it fails, then resets this.account.balance and reject the promise that update() returns', () => {
      const spy = sinon.spy(controller.$q, 'reject');
      controller.update();
      deffered.reject();
      $scope.$apply();
      expect(account.get().balance).to.equal(null);
      $rootScope.reset();
      expect(spy).to.have.been.calledWith();
    });
  });
});
