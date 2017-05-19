const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const expect = chai.expect;
chai.use(sinonChai);
const VALID_PASSPHRASE = 'illegal symbol search tree deposit youth mixture craft amazing tool soon unit';
const INVALID_PASSPHRASE = 'INVALID_PASSPHRASE';

describe('Login component', () => {
  let $compile;
  let $rootScope;
  let element;

  // Load the myApp module, which contains the directive
  beforeEach(angular.mock.module('app'));

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject((_$compile_, _$rootScope_) => {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  beforeEach(() => {
    // Compile a piece of HTML containing the directive
    element = $compile('<login></login>')($rootScope);
    $rootScope.$digest();
  });

  const HEADER_TEXT = 'Sign In';
  it(`should contain header saying "${HEADER_TEXT}"`, () => {
    expect(element.find('.md-title').text()).to.equal(HEADER_TEXT);
  });

  const PASS_LABEL_TEXT = 'Enter your passphrase';
  it(`should contain a form input with label saying "${PASS_LABEL_TEXT}"`, () => {
    expect(element.find('form md-input-container label.pass').text()).to.equal(PASS_LABEL_TEXT);
  });

  const SELECT_LABEL_TEXT = 'Network';
  it(`should contain a select element with label saying "${SELECT_LABEL_TEXT}"`, () => {
    expect(element.find('form md-input-container label.select').text()).to.equal(SELECT_LABEL_TEXT);
  });

  it('should contain an input field', () => {
    expect(element.find('form input').html()).to.equal('');
  });

  const LOGIN_BUTTON_TEXT = 'Login';
  it(`should contain a button saying "${LOGIN_BUTTON_TEXT}"`, () => {
    expect(element.find('.md-raised').text()).to.equal(LOGIN_BUTTON_TEXT);
  });
});

describe('Login controller', () => {
  beforeEach(angular.mock.module('app'));

  let $rootScope;
  let $scope;
  let $state;
  let controller;
  let $componentController;
  let Passphrase;
  let testPassphrase;
  let account;
  let $cookies;
  /* eslint-disable no-unused-vars */
  let $timeout;
  /* eslint-enable no-unused-vars */

  beforeEach(inject((_$componentController_, _$rootScope_, _$state_,
    _Passphrase_, _$cookies_, _$timeout_, _Account_) => {
    $componentController = _$componentController_;
    $rootScope = _$rootScope_;
    $state = _$state_;
    Passphrase = _Passphrase_;
    account = _Account_;
    $cookies = _$cookies_;
    /* eslint-disable no-unused-vars */
    $timeout = _$timeout_;
    /* eslint-enable no-unused-vars */
  }));

  beforeEach(() => {
    testPassphrase = 'glow two glimpse camp aware tip brief confirm similar code float defense';
    $scope = $rootScope.$new();
    controller = $componentController('login', $scope, { });
    controller.onLogin = function () {};
    controller.passphrase = '';
  });

  describe('controller()', () => {
    it('should define a watcher for $ctrl.input_passphrase', () => {
      $scope.$apply();
      const spy = sinon.spy(Passphrase, 'isValidPassphrase');
      controller.input_passphrase = INVALID_PASSPHRASE;
      $scope.$apply();
      expect(controller.valid).to.not.equal(1);
      controller.input_passphrase = VALID_PASSPHRASE;
      $scope.$apply();
      expect(controller.valid).to.equal(1);
      expect(spy).to.have.been.calledWith();
    });

    it('listens for an onAfterSignup event', () => {
      const spy = sinon.spy(controller, 'passConfirmSubmit');
      $rootScope.$broadcast('onAfterSignup', {
        passphrase: 'TEST_VALUE',
        target: 'primary-pass',
      });
      expect(spy).to.have.been.calledWith('TEST_VALUE');
    });
  });

  describe('generatePassphrase()', () => {
    it('sets this.generatingNewPassphrase = true', () => {
      controller.generatePassphrase();
      expect(controller.generatingNewPassphrase).to.equal(true);
    });
  });

  describe('passConfirmSubmit()', () => {
    it('sets account.phassphrase as this.input_passphrase processed by normalizer', () => {
      controller.input_passphrase = '\tTEST  PassPHrASe  ';
      controller.passConfirmSubmit();
      expect(account.get().passphrase).to.equal('test passphrase');
    });

    it('calls Passphrase.normalize()', () => {
      const spy = sinon.spy(Passphrase, 'normalize');
      controller.passConfirmSubmit();
      expect(spy).to.have.been.calledWith();
    });

    it('redirects to main if passphrase is valid', () => {
      controller.input_passphrase = testPassphrase;
      const spy = sinon.spy($state, 'go');
      controller.passConfirmSubmit();
      expect(spy).to.have.been.calledWith();
    });
  });

  describe('devTestAccount()', () => {
    it('sets the passphrase into passphrase input if it is set in the cookies', () => {
      $cookies.put('passphrase', testPassphrase);
      controller.devTestAccount();
      expect(controller.input_passphrase).to.equal(testPassphrase);
    });
  });
});
