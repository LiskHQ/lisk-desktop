var sinon = require('sinon');
var sinonChai = require("sinon-chai");
var expect = chai.expect;
chai.use(sinonChai);

describe('transactions component controller', function() {
  beforeEach(angular.mock.module("app"));

  var $controller,
      $rootScope,
      $scope,
      $q,
      controller;

  beforeEach(inject(function(_$componentController_, _$rootScope_, _$q_){
    $componentController = _$componentController_;
    $rootScope = _$rootScope_;
    $q = _$q_;
  }));

  beforeEach(function() {
    $scope = $rootScope.$new();
    controller = $componentController('transactions', $scope, {
      account : {
        address: "16313739661670634666L",
        balance: "0"
      }
    });
  });

  describe('$onDestroy()', function() {
    it('cancels update timeout', function() {
      var spy = sinon.spy(controller.$timeout, 'cancel');
      controller.$onDestroy();
      expect(spy).to.have.been.calledWith(controller.timeout);
    });
  });

  describe('reset()', function() {
    it('sets this.loaded = false', function() {
      controller.loaded = true;
      controller.reset();
      expect(controller.loaded).to.equal(false);
    });
  });

  describe('update(show, more)', function() {
    var activePeerMock,
        mock;

    beforeEach(function() {
      controller.$peers = {active: {getTransactions: function(){}}};
      mock = sinon.mock(controller.$peers.active);
      mock.expects("getTransactions").returns($q(function() {}));
    });

    it('sets this.loading = true', function() {
      controller.update();
      expect(controller.loading).to.equal(true);
    });

    it('sets this.loading_show = true if show == true', function() {
      controller.update(true);
      expect(controller.loading_show).to.equal(true);
    });

    it('doesn\'t change this.loading_show if show == false', function() {
      controller.update(false);
      expect(controller.loading_show).to.equal(undefined);
    });

    it('cancels update timeout', function() {
      var spy = sinon.spy(controller.$timeout, 'cancel');
      controller.update();
      expect(spy).to.have.been.calledWith(controller.timeout);
    });

    it('calls this.$peers.active.getTransactions(this.account.address, limit) with limit = 10 by default', function() {
      controller.$peers = {active: {getTransactions: function(){}}};
      mock = sinon.mock(controller.$peers.active);
      var transactionsDeferred = $q.defer();
      mock.expects("getTransactions").withArgs(controller.account.address, 10).returns(transactionsDeferred.promise);
      controller.update();
      transactionsDeferred.reject();

      //mock because $scope.apply() will call update() again.
      mock.expects("getTransactions").withArgs(controller.account.address, 10).returns(transactionsDeferred.promise);
      $scope.$apply();
      mock.verify();
      mock.restore();
    });

  });

  describe('_processTransactionsResponse(response)', function() {
    it('sets this.transactions = response.transactions', function() {
      var response = {
        transactions : [{}],
        count: 1,
      };
      controller._processTransactionsResponse(response);
      expect(controller.transactions).to.equal(response.transactions);
    });

    it('sets this.more to how many more other transactions are there on server', function() {
      var response = {
        transactions : [{}, {}],
        count: 3,
      };
      controller._processTransactionsResponse(response);
      expect(controller.more).to.equal(response.count - response.transactions.length);
    });
  });

  describe('constructor()', function() {
    it('sets $watch on acount to run reset() and update()', function() {
      var mock = sinon.mock(controller);
      mock.expects('reset').withArgs();
      mock.expects('update').withArgs();
      $scope.$apply();
      mock.verify();
      mock.restore();
    });

    it('sets to run reset() and update() $on "peerUpdate" is $emited', function() {
      var mock = sinon.mock(controller);
      mock.expects('reset').withArgs();
      mock.expects('update').withArgs(true);
      controller.$scope.$emit('peerUpdate');
      mock.verify();
      mock.restore();
    });
  });
});
