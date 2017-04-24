const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const expect = chai.expect;
chai.use(sinonChai);

describe('Send component', () => {
  let $compile;
  let $rootScope;
  let element;
  let $scope;
  let lsk;

  beforeEach(angular.mock.module('app'));

  beforeEach(inject((_$compile_, _$rootScope_, _lsk_) => {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    lsk = _lsk_;
  }));

  beforeEach(() => {
    $scope = $rootScope.$new();
    $scope.passphrase = 'robust swift grocery peasant forget share enable convince deputy road keep cheap';
    $scope.account = {
      address: '8273455169423958419L',
      balance: lsk.from(10535.77379498),
    };
    element = $compile('<send passphrase="passphrase" account="account"></send>')($scope);
    $scope.$digest();
  });

  const HEADER_TEXT = 'Send';
  it(`should contain header saying "${HEADER_TEXT}"`, () => {
    expect(element.find('.md-title').text()).to.equal(HEADER_TEXT);
  });

  const RECIPIENT_LABEL_TEXT = 'Recipient Address';
  it(`should contain a form with label saying "${RECIPIENT_LABEL_TEXT}"`, () => {
    expect(element.find('form label:first').text()).to.equal(RECIPIENT_LABEL_TEXT);
  });

  const AMOUT_LABEL_TEXT = 'Transaction Amount';
  it(`should contain a form with label saying "${AMOUT_LABEL_TEXT}"`, () => {
    expect(element.find('form label:last').text()).to.equal(AMOUT_LABEL_TEXT);
  });

  const LOGIN_BUTTON_TEXT = 'Send';
  it(`should contain a button saying "${LOGIN_BUTTON_TEXT}"`, () => {
    expect(element.find('button.md-raised').text()).to.equal(LOGIN_BUTTON_TEXT);
  });

  describe('send transaction', () => {
    let $q;
    let $peers;
    let success;

    beforeEach(inject((_success_, _$q_, _$peers_) => {
      success = _success_;
      $q = _$q_;
      $peers = _$peers_;
    }));

    it('should allow to send a transaction', () => {
      const RECIPIENT_ADDRESS = '5932438298200837883L';
      const AMOUNT = '10';

      $peers.active = { sendLSKPromise() {} };
      const mock = sinon.mock($peers.active);
      const deffered = $q.defer();
      mock.expects('sendLSKPromise').returns(deffered.promise);

      const spy = sinon.spy(success, 'dialog');

      element.find('form input[name="amount"]').val(AMOUNT).trigger('input');
      element.find('form input[name="recipient"]').val(RECIPIENT_ADDRESS).trigger('input');
      $scope.$apply();
      element.find('button.md-raised').click();

      deffered.resolve({});
      $scope.$apply();
      expect(spy).to.have.been.calledWith({ text: `${AMOUNT} sent to ${RECIPIENT_ADDRESS}` });
      mock.verify();
    });

    it('should allow to send all funds', () => {
      const RECIPIENT_ADDRESS = '5932438298200837883L';
      const AMOUNT = lsk.normalize($scope.account.balance - 10000000);

      $peers.active = { sendLSKPromise() {} };
      const mock = sinon.mock($peers.active);
      const deffered = $q.defer();
      mock.expects('sendLSKPromise').returns(deffered.promise);

      const spy = sinon.spy(success, 'dialog');

      element.find('md-menu-item button').click();
      element.find('form input[name="recipient"]').val(RECIPIENT_ADDRESS).trigger('input');
      $scope.$apply();
      expect(element.find('form input[name="amount"]').val()).to.equal(`${AMOUNT}`);
      element.find('button.md-raised').click();

      deffered.resolve({});
      $scope.$apply();
      expect(spy).to.have.been.calledWith();
      expect(spy).to.have.been.calledWith({ text: `${AMOUNT} sent to ${RECIPIENT_ADDRESS}` });
      mock.verify();
    });
  });
});

describe('send component controller', () => {
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

    it('calls this.$peers.active.sendLSKPromise() and success.dialog on success', () => {
      controller.$peers = { active: { sendLSKPromise() {} } };
      const mock = sinon.mock(controller.$peers.active);
      const deffered = $q.defer();
      mock.expects('sendLSKPromise').returns(deffered.promise);
      controller.go();

      const spy = sinon.spy(controller.success, 'dialog');
      deffered.resolve({});
      $scope.$apply();
      expect(spy).to.have.been.calledWith({
        text: `${controller.amount.value} sent to ${controller.recipient.value}`,
      });
    });

    it('calls this.$peers.active.sendLSKPromise() and error.dialog on error', () => {
      controller.$peers = { active: { sendLSKPromise() {} } };
      const mock = sinon.mock(controller.$peers.active);
      const deffered = $q.defer();
      mock.expects('sendLSKPromise').returns(deffered.promise);
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
