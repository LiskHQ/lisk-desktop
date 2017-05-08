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
  let account;

  beforeEach(angular.mock.module('app'));

  beforeEach(inject((_$compile_, _$rootScope_, _lsk_, _Account_) => {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    lsk = _lsk_;
    account = _Account_;
  }));

  beforeEach(() => {
    $scope = $rootScope.$new();
    account.set({
      passphrase: 'robust swift grocery peasant forget share enable convince deputy road keep cheap',
      balance: lsk.from(10535.77379498),
    });

    element = $compile('<send passphrase="passphrase" account="account"></send>')($scope);
    $scope.$digest();
  });

  const HEADER_TEXT = 'Send';
  it(`should contain header saying "${HEADER_TEXT}"`, () => {
    expect(element.find('form md-toolbar .md-toolbar-tools h2').text()).to.equal(HEADER_TEXT);
  });

  const RECIPIENT_LABEL_TEXT = 'Recipient Address';
  it(`should contain a form with label saying "${RECIPIENT_LABEL_TEXT}"`, () => {
    expect(element.find('form label:first').text()).to.equal(RECIPIENT_LABEL_TEXT);
  });

  const AMOUT_LABEL_TEXT = 'Transaction Amount';
  it(`should contain a form with label saying "${AMOUT_LABEL_TEXT}"`, () => {
    expect(element.find('form label:last').text()).to.equal(AMOUT_LABEL_TEXT);
  });

  const SEND_BUTTON_TEXT = 'Send';
  it(`should contain a button saying "${SEND_BUTTON_TEXT}"`, () => {
    expect(element.find('button.md-raised.md-primary').text()).to.equal(SEND_BUTTON_TEXT);
  });

  const CANCEL_BUTTON_TEXT = 'Cancel';
  it(`should contain a button saying "${CANCEL_BUTTON_TEXT}"`, () => {
    expect(element.find('button.md-raised.md-secondary').text()).to.equal(CANCEL_BUTTON_TEXT);
  });

  describe('send transaction', () => {
    let dialog;
    let $q;

    beforeEach(inject((_dialog_, _$q_) => {
      dialog = _dialog_;
      $q = _$q_;
    }));

    it('should allow to send a transaction', () => {
      const RECIPIENT_ADDRESS = '5932438298200837883L';
      const AMOUNT = '10';

      const mock = sinon.mock(account);
      const deffered = $q.defer();
      mock.expects('sendLSK').returns(deffered.promise);

      const spy = sinon.spy(dialog, 'successAlert');

      element.find('form input[name="amount"]').val(AMOUNT).trigger('input');
      element.find('form input[name="recipient"]').val(RECIPIENT_ADDRESS).trigger('input');
      $scope.$apply();
      element.find('button.md-raised.md-primary').click();

      deffered.resolve({});
      $scope.$apply();
      expect(spy).to.have.been.calledWith({ text: `${AMOUNT} sent to ${RECIPIENT_ADDRESS}` });
      mock.verify();
    });

    it('should allow to send all funds', () => {
      const RECIPIENT_ADDRESS = '5932438298200837883L';
      const AMOUNT = lsk.normalize(account.get().balance - 10000000);

      const mock = sinon.mock(account);
      const deffered = $q.defer();
      mock.expects('sendLSK').returns(deffered.promise);

      const spy = sinon.spy(dialog, 'successAlert');

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
  let account;

  beforeEach(inject((_$componentController_, _$rootScope_, _$q_, _Account_) => {
    $componentController = _$componentController_;
    $rootScope = _$rootScope_;
    $q = _$q_;
    account = _Account_;
  }));

  beforeEach(() => {
    $scope = $rootScope.$new();
    controller = $componentController('send', $scope, {});
    account.set({
      balance: '10000',
      passphrase: 'robust swift grocery peasant forget share enable convince deputy road keep cheap',
    });
  });

  describe('reset()', () => {
    it('resets this.recipient.value and this.amount.value', () => {
      controller.recipient.value = 'TEST';
      controller.amount.value = '1000';
      controller.sendForm = { $setUntouched: () => {} };
      const mock = sinon.mock(controller.sendForm);
      mock.expects('$setUntouched');

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

    it('calls this.account.sendLSK() and success.dialog on success', () => {
      const mock = sinon.mock(controller.account);
      const deffered = $q.defer();
      mock.expects('sendLSK').returns(deffered.promise);
      controller.go();

      const spy = sinon.spy(controller.dialog, 'successAlert');
      deffered.resolve({});
      $scope.$apply();
      expect(spy).to.have.been.calledWith({
        text: `${controller.amount.value} sent to ${controller.recipient.value}`,
      });
    });

    it('calls this.account.sendLSK() and error.dialog on error', () => {
      const mock = sinon.mock(controller.account);
      const deffered = $q.defer();
      mock.expects('sendLSK').returns(deffered.promise);
      controller.go();

      const spy = sinon.spy(controller.dialog, 'errorAlert');
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
