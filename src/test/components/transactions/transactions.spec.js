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

  beforeEach(inject((_$componentController_, _$rootScope_, _$q_) => {
    $componentController = _$componentController_;
    $rootScope = _$rootScope_;
    $q = _$q_;
  }));

  beforeEach(() => {
    $scope = $rootScope.$new();
    controller = $componentController('transactions', $scope, {
      account: {
        address: '16313739661670634666L',
        balance: '0',
      },
    });
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

  describe('update(show, more)', () => {
    let mock;

    beforeEach(() => {
      controller.$peers = { active: { getTransactions() {} } };
      mock = sinon.mock(controller.$peers.active);
      mock.expects('getTransactions').returns($q(() => {}));
    });

    it('sets this.loading = true', () => {
      controller.update();
      expect(controller.loading).to.equal(true);
    });

    it('sets this.loading_show = true if show == true', () => {
      controller.update(true);
      expect(controller.loading_show).to.equal(true);
    });

    it('doesn\'t change this.loading_show if show == false', () => {
      controller.update(false);
      expect(controller.loading_show).to.equal(undefined);
    });

    it('cancels update timeout', () => {
      const spy = sinon.spy(controller.$timeout, 'cancel');
      controller.update();
      expect(spy).to.have.been.calledWith(controller.timeout);
    });

    it('calls this.$peers.active.getTransactions(this.account.address, limit) with limit = 10 by default', () => {
      controller.$peers = { active: { getTransactions() {} } };
      mock = sinon.mock(controller.$peers.active);
      const transactionsDeferred = $q.defer();
      mock.expects('getTransactions').withArgs(controller.account.address, 10).returns(transactionsDeferred.promise);
      controller.update();
      transactionsDeferred.reject();

      // Mock because $scope.apply() will call update() again
      mock.expects('getTransactions').withArgs(controller.account.address, 10).returns(transactionsDeferred.promise);
      $scope.$apply();
      mock.verify();
      mock.restore();
    });
  });

  describe('_processTransactionsResponse(response)', () => {
    it('sets this.transactions = response.transactions', () => {
      const response = {
        transactions: [{}],
        count: 1,
      };
      controller._processTransactionsResponse(response);
      expect(controller.transactions).to.equal(response.transactions);
    });

    it('sets this.more to how many more other transactions are there on server', () => {
      const response = {
        transactions: [{}, {}],
        count: 3,
      };
      controller._processTransactionsResponse(response);
      expect(controller.more).to.equal(response.count - response.transactions.length);
    });
  });

  describe('constructor()', () => {
    it('sets $watch on acount to run reset() and update()', () => {
      const mock = sinon.mock(controller);
      mock.expects('reset').withArgs();
      mock.expects('update').withArgs();
      $scope.$apply();
      mock.verify();
      mock.restore();
    });

    it('sets to run reset() and update() $on "peerUpdate" is $emited', () => {
      const mock = sinon.mock(controller);
      mock.expects('reset').withArgs();
      mock.expects('update').withArgs(true);
      controller.$scope.$emit('peerUpdate');
      mock.verify();
      mock.restore();
    });
  });
});
