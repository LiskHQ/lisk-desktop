const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const expect = chai.expect;
chai.use(sinonChai);

describe.skip('Transfer component', () => {
  let $compile;
  let $rootScope;
  let element;
  let $scope;
  let lsk;
  let account;
  let accountApi;

  beforeEach(angular.mock.module('app'));

  beforeEach(inject((_$compile_, _$rootScope_, _lsk_, _Account_, _AccountApi_) => {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    lsk = _lsk_;
    account = _Account_;
    accountApi = _AccountApi_;
  }));

  beforeEach(() => {
    $scope = $rootScope.$new();
    account.set({
      passphrase: 'robust swift grocery peasant forget share enable convince deputy road keep cheap',
      balance: lsk.from(10535.77379498),
    });

    element = $compile('<transfer passphrase="passphrase" account="account"></transfer>')($scope);
    $scope.$digest();
  });

  const HEADER_TEXT = 'Transfer';
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

  const TRANSFER_BUTTON_TEXT = 'Transfer';
  it(`should contain a button saying "${TRANSFER_BUTTON_TEXT}"`, () => {
    expect(element.find('button.md-raised.md-primary').text()).to.equal(TRANSFER_BUTTON_TEXT);
  });

  const CANCEL_BUTTON_TEXT = 'Cancel';
  it(`should contain a button saying "${CANCEL_BUTTON_TEXT}"`, () => {
    expect(element.find('button.md-raised.md-secondary').text()).to.equal(CANCEL_BUTTON_TEXT);
  });

  describe('create transaction', () => {
    let dialog;
    let $q;

    beforeEach(inject((_dialog_, _$q_) => {
      dialog = _dialog_;
      $q = _$q_;
    }));

    it('should allow to create a transaction', () => {
      const RECIPIENT_ADDRESS = '5932438298200837883L';
      const AMOUNT = '10';

      const mock = sinon.mock(account);
      const deffered = $q.defer();
      mock.expects('transfer').returns(deffered.promise);

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

    it('should allow to transfer all funds', () => {
      const RECIPIENT_ADDRESS = '5932438298200837883L';
      const AMOUNT = lsk.normalize(account.get().balance - 10000000);

      const mock = sinon.mock(accountApi);
      const deffered = $q.defer();
      mock.expects('transactions.create').returns(deffered.promise);

      const spy = sinon.spy(dialog, 'successAlert');

      element.find('md-menu-item button').click();
      element.find('form input[name="recipient"]').val(RECIPIENT_ADDRESS).trigger('input');
      $scope.$apply();
      expect(element.find('form input[name="amount"]').val()).to.equal(`${AMOUNT}`);
      element.find('button.md-raised').click();

      deffered.resolve({});
      $scope.$apply();
      expect(spy).to.have.been.calledWith();
      expect(spy).to.have.been.calledWith({ text: `${AMOUNT} LSK was successfully transferred to ${RECIPIENT_ADDRESS}` });
      mock.verify();
    });
  });
});

describe('Transfer component controller', () => {
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
    controller = $componentController('transfer', $scope, {});
    account.set({
      balance: '10000',
      passphrase: 'robust swift grocery peasant forget share enable convince deputy road keep cheap',
    });
  });

  describe('reset()', () => {
    it('resets this.recipient.value and this.amount.value', () => {
      controller.recipient.value = 'TEST';
      controller.amount.value = '1000';
      controller.transferForm = { $setUntouched: () => {} };
      const mock = sinon.mock(controller.transferForm);
      mock.expects('$setUntouched');

      controller.reset();

      expect(controller.recipient.value).to.equal('');
      expect(controller.amount.value).to.equal('');
    });
  });

  describe('transfer()', () => {
    it('calls accountApi.transactions.create and success.dialog on success', () => {
      const mock = sinon.mock(controller.accountApi.transactions);
      const deffered = $q.defer();
      mock.expects('create').returns(deffered.promise);
      controller.transfer();

      const spy = sinon.spy(controller.dialog, 'successAlert');
      deffered.resolve({});
      $scope.$apply();
      expect(spy).to.have.been.calledWith({
        text: `${controller.amount.value} LSK was successfully transferred to ${controller.recipient.value}`,
      });
    });

    it('calls accountApi.transactions.create and error.dialog on error', () => {
      const mock = sinon.mock(controller.accountApi.transactions);
      const deffered = $q.defer();
      mock.expects('create').returns(deffered.promise);
      controller.transfer();

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
