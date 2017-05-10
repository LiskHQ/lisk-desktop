const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const expect = chai.expect;
chai.use(sinonChai);

describe('transactions component controller', () => {
  beforeEach(angular.mock.module('app'));

  let $rootScope;
  let $scope;
  let $q;
  let controller;
  let $componentController;
  let account;
  let accountApi;
  let mock;

  beforeEach(inject((_$componentController_, _$rootScope_, _$q_, _Account_, _AccountApi_) => {
    $componentController = _$componentController_;
    $rootScope = _$rootScope_;
    $q = _$q_;
    account = _Account_;
    accountApi = _AccountApi_;
  }));

  beforeEach(() => {
    $scope = $rootScope.$new();
    mock = sinon.mock(accountApi.transactions);
    const deffered = $q.defer();
    mock.expects('get').returns(deffered.promise);
    mock.expects('get').returns(deffered.promise);
    controller = $componentController('transactions', $scope, {});
    account.set({
      passphrase: 'robust swift grocery peasant forget share enable convince deputy road keep cheap',
      balance: '0',
    });
  });

  afterEach(() => {
    mock.verify();
    mock.restore();
  });

  describe('$onDestroy()', () => {
    it('cancels update timeout', () => {
      const spy = sinon.spy(controller.$timeout, 'cancel');
      controller.$onDestroy();
      expect(spy).to.have.been.calledWith(controller.timeout);
    });
  });

  describe('reset()', () => {
    it('sets this.loaded = false', () => {
      controller.loaded = true;
      controller.reset();
      expect(controller.loaded).to.equal(false);
    });
  });

  describe('showMore()', () => {
    it('calls this.update(true, true) if this.moreTransactionsExist', () => {
      controller.moreTransactionsExist = true;
      mock.expects('get').returns($q.defer().promise);
      controller.loaded = true;
      controller.showMore();
      expect(controller.loaded).to.equal(false);
    });

    it('does nothing if not this.moreTransactionsExist', () => {
      controller.moreTransactionsExist = false;
      controller.loaded = undefined;
      controller.showMore();
      expect(controller.loaded).to.equal(undefined);
    });
  });

  describe('update(showLoading, showMore)', () => {
    let transactionsDeferred;

    beforeEach(() => {
      transactionsDeferred = $q.defer();
    });

    it('sets this.loaded = false if showLoading == true', () => {
      mock.expects('get').returns(transactionsDeferred.promise);
      controller.loaded = undefined;
      controller.update(true);
      expect(controller.loaded).to.equal(false);
    });

    it('doesn\'t change this.loaded if showLoading == false', () => {
      mock.expects('get').returns(transactionsDeferred.promise);
      controller.loaded = undefined;
      controller.update(false);
      expect(controller.loaded).to.equal(undefined);
    });

    it('cancels update timeout', () => {
      mock.expects('get').returns(transactionsDeferred.promise);
      const spy = sinon.spy(controller.$timeout, 'cancel');
      controller.update();
      expect(spy).to.have.been.calledWith(controller.timeout);
    });

    it('calls accountApi.transactions.get(account.get().address, limit) with limit = 10 by default', () => {
      mock.expects('get').withArgs(account.get().address, 10).returns(transactionsDeferred.promise);
      controller.update();
      transactionsDeferred.reject();

      $scope.$apply();
    });
  });

  describe('_processTransactionsResponse(response)', () => {
    it('sets this.transactions = response.transactions', () => {
      const response = {
        transactions: [{}],
        count: 1,
      };
      controller._processTransactionsResponse(response);
      expect(controller.transactions).to.deep.equal(response.transactions);
    });

    it('sets this.moreTransactionsExist to how many more other transactions are there on server', () => {
      const response = {
        transactions: [{}, {}],
        count: 3,
      };
      controller._processTransactionsResponse(response);
      expect(controller.moreTransactionsExist).to.equal(
        response.count - response.transactions.length);
    });
  });

  describe('constructor()', () => {
    it('sets $watch on acount to run init()', () => {
      mock = sinon.mock(controller);
      mock.expects('init').withArgs();
      account.set({ balance: 1000 });
      $scope.$apply();
    });

    it('sets to run reset() and update() $on "peerUpdate" is $emited', () => {
      mock = sinon.mock(controller);
      mock.expects('reset').withArgs();
      mock.expects('update').withArgs(true);
      controller.$scope.$emit('peerUpdate');
    });
  });
});
