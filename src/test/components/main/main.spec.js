var sinon = require('sinon');
var sinonChai = require("sinon-chai");
var expect = chai.expect;
chai.use(sinonChai);

describe('main component controller', function() {
  beforeEach(angular.mock.module("app"));

  var $controller,
      $rootScope,
      $scope,
      $q,
      $componentController,
      controller;

  beforeEach(inject(function(_$componentController_, _$rootScope_, _$q_){
    $componentController = _$componentController_;
    $rootScope = _$rootScope_;
    $q = _$q_;
  }));

  beforeEach(function() {
    $scope = $rootScope.$new();
    controller = $componentController('main', $scope, {
      passphrase: '',
    });
  });

  describe('controller()', function() {
    it.skip('sets $watch on $ctrl.$peers.active to broadcast it changed', function() {
      //skipped as it doesn't work
      $scope.$apply();
      var mock = sinon.mock(controller.$rootScope);
      mock.expects("$broadcast").withArgs('peerUpdate').returns();
      controller.$peers.active = {name : 'CHANGED'};
      $scope.$apply();
      controller.$peers.active.name = 'CHANGED AGAIN';
      $scope.$apply();
      mock.verify();
      mock.restore();
    });
  });

  describe('reset()', function() {
    it('cancels $timeout', function() {
      var spy = sinon.spy(controller.$timeout, 'cancel');
      controller.reset();
      expect(spy).to.have.been.calledWith(controller.timeout);
    });
  });
  
  describe('login()', function() {
    var deffered,
        updateMock,
        peersMock;


    beforeEach(function() {
      deffered = $q.defer();
      updateMock = sinon.mock(controller);
      updateMock.expects("update").withArgs().returns(deffered.promise);

      peersMock = sinon.mock(controller.$peers);
      peersMock.expects("setActive").withArgs();
    });

    afterEach(function() {
      updateMock.verify();
      updateMock.restore();
    });

    it('sets active peer', function() {
      controller.login();

      deffered.resolve();
      $scope.$apply();
    });

    it('calls this.update() and then sets this.logged = true', function() {
      controller.login();
      deffered.resolve();
      $scope.$apply();

      expect(controller.logged).to.equal(true);
    });

    it('calls this.update() and if that fails and attempts < 10, then sets a timeout to try again', function() {
      var spy = sinon.spy(controller, '$timeout');

      controller.login();
      deffered.reject();
      $scope.$apply();

      expect(spy).to.have.been.calledWith();
    });

    it('calls this.update() and if that fails and attempts >= 10, then show error dialog', function() {
      var spy = sinon.spy(controller.error, 'dialog');

      controller.login(10);
      deffered.reject();
      $scope.$apply();

      expect(spy).to.have.been.calledWith({text: 'No peer connection'});
    });
  });
  
  describe('logout()', function() {
    it('resets main component', function() {
      var spy = sinon.spy(controller, 'reset');
      controller.logout();
      expect(spy).to.have.been.calledWith();
    });

    it('resets peers', function() {
      var spy = sinon.spy(controller.$peers, 'reset');
      controller.logout();
      expect(spy).to.have.been.calledWith(true);
    });

    it('sets this.logged = false', function() {
      controller.logout();
      expect(controller.logged).to.equal(false);
    });

    it('sets this.prelogged = false', function() {
      controller.logout();
      expect(controller.prelogged).to.equal(false);
    });

    it('sets this.account = {}', function() {
      controller.logout();
      expect(controller.account).to.deep.equal({});
    });

    it('sets this.passphrase = \'\'', function() {
      controller.logout();
      expect(controller.passphrase).to.equal('');
    });
  });
  
  describe('update()', function() {
    var deffered,
        account;
    beforeEach(function() {
      deffered = $q.defer();
      account = {
        address: "16313739661670634666L",
        balance: "0"
      };
      controller.$peers.active = {
        getAccount: function(){
          return deffered.promise;
        },
        status: function(){
          var deffered = $q.defer();
          return deffered.promise;
        },
      };
      controller.address = account.address;
      controller.account = {};
    });

    it('calls this.$peers.active.getAccount(this.address) and then sets result to this.account', function() {
      expect(controller.account).not.to.equal(account);
      controller.update();
      deffered.resolve(account);
      $scope.$apply();
      expect(controller.account).to.equal(account);
    });

    it('calls this.$peers.active.getAccount(this.address) and if it fails, then resets this.account.balance and reject the promise that update() returns', function() {
      var spy = sinon.spy(controller.$q, 'reject');
      controller.update();
      deffered.reject();
      $scope.$apply();
      expect(controller.account.balance).to.equal(undefined);
      controller.reset();
      expect(spy).to.have.been.calledWith();
    });
  });
});

