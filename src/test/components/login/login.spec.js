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

  const SELECT_LABEL_TEXT = 'Choose a peer';
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
  let controller;
  let $componentController;
  let Passphrase;

  beforeEach(inject((_$componentController_, _$rootScope_, _Passphrase_) => {
    $componentController = _$componentController_;
    $rootScope = _$rootScope_;
    Passphrase = _Passphrase_;
  }));

  beforeEach(() => {
    $scope = $rootScope.$new();
    controller = $componentController('login', $scope, { });
    controller.onLogin = function () {};
    controller.passphrase = '';
  });

  describe('controller()', () => {
    it('should define a watcher for $ctrl.$peers.currentPeerConfig', () => {
      $scope.$apply();
      const peers = controller.$peers;
      const spy = sinon.spy(peers, 'setActive');
      peers.currentPeerConfig = peers.stack.localhost[0];
      $scope.$apply();
      peers.currentPeerConfig = peers.stack.official[0];
      $scope.$apply();
      expect(spy).to.have.been.calledWith();
    });

    it('should be able to change the active peer', () => {
      $scope.$apply();
      controller.$peers.setActive(controller.$peers.stack.localhost[0]);
      $scope.$apply();
      expect(controller.$peers.currentPeerConfig).to.equal(controller.$peers.stack.localhost[0]);
      controller.$peers.setActive(controller.$peers.stack.official[0]);
      $scope.$apply();
      expect(controller.$peers.currentPeerConfig).to.equal(controller.$peers.stack.official[0]);
    });

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

    it('Listens for broadcasting onAfterSignup', () => {
      const spy = sinon.spy(controller, 'passConfirmSubmit');
      $rootScope.$broadcast('onAfterSignup', {
        passphrase: 'TEST_VALUE',
        target: 'primary-pass',
      });
      expect(spy).to.have.been.calledWith('TEST_VALUE');
    });
  });

  // OK
  describe('$scope.generatePassphrase()', () => {
    it('sets this.generatingNewPassphrase = true', () => {
      controller.generatePassphrase();
      expect(controller.generatingNewPassphrase).to.equal(true);
    });
  });
  // OK
  describe('componentController.passConfirmSubmit()', () => {
    it('sets this.phassphrase as this.input_passphrase processed by normalizer', () => {
      controller.input_passphrase = '\tTEST  PassPHrASe  ';
      controller.passConfirmSubmit();
      expect(controller.passphrase).to.equal('test passphrase');
    });

    it('calls Passphrase.normalize()', () => {
      const spy = sinon.spy(Passphrase, 'normalize');
      controller.passConfirmSubmit();
      expect(spy).to.have.been.calledWith();
    });

    it('sets timeout with this.onLogin', () => {
      const spy = sinon.spy(controller, '$timeout');
      controller.passConfirmSubmit();
      expect(spy).to.have.been.calledWith(controller.onLogin);
    });
  });
});
