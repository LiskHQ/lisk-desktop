const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const expect = chai.expect;
chai.use(sinonChai);

describe('send component controller', () => {
  beforeEach(angular.mock.module('app'));

  let $rootScope;
  let $scope;
  let $q;
  let controller;

  beforeEach(inject((_$componentController_, _$rootScope_, _$q_) => {
    $componentController = _$componentController_;
    $rootScope = _$rootScope_;
    $q = _$q_;
  }));

  beforeEach(() => {
    $scope = $rootScope.$new();
    controller = $componentController('send', $scope, {
      account: {
        address: '8273455169423958419L',
        balance: '10000',
      },
      passphrase: 'robust swift grocery peasant forget share enable convince deputy road keep cheap',
    });
  });

  describe('reset()', () => {
    it('resets this.recipient.value and this.amount.value', () => {
      controller.recipient.value = 'TEST';
      controller.amount.value = '1000';
      controller.reset();
      expect(controller.recipient.value).to.equal('');
      expect(controller.amount.value).to.equal('');
    });
  });

  describe('promptSecondPassphrase()', () => {
    it('creates promise that resolves right away if !this.account.secondSignature', () => {
      const promise = controller.promptSecondPassphrase();
      const spy = sinon.spy(() => {});
      promise.then(spy);
      $scope.$apply();
      expect(spy).to.have.been.calledWith();
    });

    it('creates promise with a modal dialog if this.account.secondSignature', () => {
      controller.account.secondSignature = 'TEST';
      const spy = sinon.spy(controller.$mdDialog, 'show');
      controller.promptSecondPassphrase();
      expect(spy).to.have.been.calledWith();
    });
  });

  describe('go()', () => {
    it('calls promptSecondPassphrase()', () => {
      const spy = sinon.spy(controller, 'promptSecondPassphrase');
      controller.go();
      expect(spy).to.have.been.calledWith();
    });

    it('calls this.$peers.active.sendTransaction() and success.dialog on success', () => {
      controller.$peers = { active: { sendTransaction() {} } };
      mock = sinon.mock(controller.$peers.active);
      const deffered = $q.defer();
      mock.expects('sendTransaction').returns(deffered.promise);
      controller.go();

      const spy = sinon.spy(controller.success, 'dialog');
      deffered.resolve();
      $scope.$apply();
      expect(spy).to.have.been.calledWith({
        text: `${controller.amount.value} sent to ${controller.recipient.value}`,
      });
    });

    it('calls this.$peers.active.sendTransaction() and error.dialog on error', () => {
      controller.$peers = { active: { sendTransaction() {} } };
      mock = sinon.mock(controller.$peers.active);
      const deffered = $q.defer();
      mock.expects('sendTransaction').returns(deffered.promise);
      controller.go();

      const spy = sinon.spy(controller.error, 'dialog');
      const response = {
        message: 'error',
      };
      deffered.reject(response);
      $scope.$apply();
      expect(spy).to.have.been.calledWith({
        text: response.message,
      });
    });
  });
});
