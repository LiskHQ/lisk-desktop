var sinon = require('sinon');
var sinonChai = require("sinon-chai");
var expect = chai.expect;
chai.use(sinonChai);

describe('send component controller', function() {
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
    controller = $componentController('send', $scope, {
      account : {
        address: "8273455169423958419L",
        balance: "10000"
      },
      passphrase: 'robust swift grocery peasant forget share enable convince deputy road keep cheap',
    });
  });

  describe('reset()', function() {
    it('resets this.recipient.value and this.amount.value', function() {
      controller.recipient.value = 'TEST';
      controller.amount.value = '1000';
      controller.reset();
      expect(controller.recipient.value).to.equal('');
      expect(controller.amount.value).to.equal('');
    });
  });

  describe('promptSecondPassphrase()', function() {
    it('creates promise that resolves right away if !this.account.secondSignature', function() {
      var promise = controller.promptSecondPassphrase();
      var spy = sinon.spy(function(){});
      promise.then(spy);
      $scope.$apply();
      expect(spy).to.have.been.calledWith();
    });

    it('creates promise with a modal dialog if this.account.secondSignature', function() {
      controller.account.secondSignature = 'TEST';
      var spy = sinon.spy(controller.$mdDialog, 'show');
      var promise = controller.promptSecondPassphrase();
      expect(spy).to.have.been.calledWith();
    });
  });

  describe('go()', function() {
    it('calls promptSecondPassphrase()', function() {
      var spy = sinon.spy(controller, 'promptSecondPassphrase');
      controller.go();
      expect(spy).to.have.been.calledWith();
    });

    it('calls this.$peers.active.sendTransaction() and success.dialog on success', function() {
      controller.$peers = {active: {sendTransaction: function(){}}};
      mock = sinon.mock(controller.$peers.active);
      var deffered = $q.defer();
      mock.expects("sendTransaction").returns(deffered.promise);
      controller.go();
      
      var spy = sinon.spy(controller.success, 'dialog');
      deffered.resolve();
      $scope.$apply();
      expect(spy).to.have.been.calledWith({
        text: controller.amount.value + ' sent to ' + controller.recipient.value
      });
    });

    it('calls this.$peers.active.sendTransaction() and error.dialog on error', function() {
      controller.$peers = {active: {sendTransaction: function(){}}};
      mock = sinon.mock(controller.$peers.active);
      var deffered = $q.defer();
      mock.expects("sendTransaction").returns(deffered.promise);
      controller.go();
      
      var spy = sinon.spy(controller.error, 'dialog');
      var response = {
        message: 'error'
      };
      deffered.reject(response);
      $scope.$apply();
      expect(spy).to.have.been.calledWith({
        text: response.message 
      });
    });
  });
});

