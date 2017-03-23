const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const expect = chai.expect;
chai.use(sinonChai);

describe('Login component', () => {
  let $compile;
  let $rootScope;
  let element;
  let cookies;

  // Load the myApp module, which contains the directive
  beforeEach(angular.mock.module('app'));

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject((_$compile_, _$rootScope_, _$cookies_) => {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $cookies = _$cookies_;
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

  const LABEL_TEXT = 'Enter your passphrase';
  it(`should contain a form with label saying "${LABEL_TEXT}"`, () => {
    expect(element.find('form label').text()).to.equal(LABEL_TEXT);
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

  let $controller;
  let $rootScope;
  let $scope;
  let controller;

  beforeEach(inject((_$componentController_, _$rootScope_) => {
    $componentController = _$componentController_;
    $rootScope = _$rootScope_;
  }));

  beforeEach(() => {
    $scope = $rootScope.$new();
    controller = $componentController('login', $scope, { });
    controller.onLogin = function () {};
    controller.passphrase = '';
  });

  describe('$scope.reset()', () => {
    it('makes input_passphrase empty', () => {
      passphrase = 'TEST';
      controller.input_passphrase = passphrase;
      expect(controller.input_passphrase).to.equal(passphrase);
      controller.reset();
      expect(controller.input_passphrase).to.equal('');
    });
  });

  describe('$scope.stopNewPassphraseGeneration()', () => {
    it('sets this.generatingNewPassphrase = false', () => {
      controller.generatingNewPassphrase = true;
      controller.stopNewPassphraseGeneration();
      expect(controller.generatingNewPassphrase).to.equal(false);
    });

    it('unbinds mousemove listener', () => {
      const unbindSpy = sinon.spy(controller.$document, 'unbind');
      controller.stopNewPassphraseGeneration();
      expect(unbindSpy).to.have.been.calledWith('mousemove', controller.listener);
    });
  });

  describe('$scope.startGenratingNewPassphrase()', () => {
    it('sets this.generatingNewPassphrase = true', () => {
      controller.startGenratingNewPassphrase();
      expect(controller.generatingNewPassphrase).to.equal(true);
    });

    it('unbinds mousemove listener', () => {
      const spy = sinon.spy(controller, 'reset');
      controller.startGenratingNewPassphrase();
      expect(spy).to.have.been.calledWith();
    });
  });

  describe('$scope.doTheLogin()', () => {
    it('sets this.phassphrase as this.input_passphrase processed by fixCaseAndWhitespace', () => {
      controller.input_passphrase = '\tTEST  PassPHrASe  ';
      controller.doTheLogin();
      expect(controller.passphrase).to.equal('test passphrase');
    });

    it('calls this.reset()', () => {
      const spy = sinon.spy(controller, 'reset');
      controller.doTheLogin();
      expect(spy).to.have.been.calledWith();
    });

    it('sets timeout with this.onLogin', () => {
      const spy = sinon.spy(controller, '$timeout');
      controller.doTheLogin();
      expect(spy).to.have.been.calledWith(controller.onLogin);
    });
  });

  describe('$scope.constructor()', () => {
    it.skip('sets $watch on $ctrl.input_passphrase to keep validating it', () => {
      // Skipped because it doesn't work
      const spy = sinon.spy(controller.$scope, '$watch');
      controller.constructor();
      expect(spy).to.have.been.calledWith('$ctrl.input_passphrase', controller.isValidPassphrase);
    });

    it.skip('sets $watch that sets customFullscreen on small screens', () => {
    });
  });

  describe('$scope.simulateMousemove()', () => {
    it('calls this.$document.mousemove()', () => {
      const spy = sinon.spy(controller.$document, 'mousemove');
      controller.simulateMousemove();
      expect(spy).to.have.been.calledWith();
    });
  });

  describe('$scope.setNewPassphrase()', () => {
    it('opens a material design dialog', () => {
      const seed = ['23', '34', '34', '34', '34', '34', '34', '34'];
      const dialogSpy = sinon.spy(controller.$mdDialog, 'show');
      controller.setNewPassphrase(seed);
      expect(dialogSpy).to.have.been.calledWith();
    });
  });

  describe('$scope.devTestAccount()', () => {
    it('sets input_passphrase from cookie called passphrase if present', () => {
      const testPassphrase = 'test passphrase';
      const mock = sinon.mock(controller.$cookies);
      mock.expects('get').returns(testPassphrase);
      controller.devTestAccount();
      expect(controller.input_passphrase).to.equal(testPassphrase);
    });

    it('does nothing if cooke called passphrase not present', () => {
      const testPassphrase = 'test passphrase';
      controller.input_passphrase = testPassphrase;
      const mock = sinon.mock(controller.$cookies);

      mock.expects('get').returns(undefined);
      controller.devTestAccount();
      expect(controller.input_passphrase).to.equal(testPassphrase);
    });
  });

  describe('$scope.isValidPassphrase(value)', () => {
    it('sets $scope.valid = 2 if  value is empty', () => {
      controller.isValidPassphrase('');
      expect(controller.valid).to.equal(2);
    });

    it('sets $scope.valid = 1 if value is valid', () => {
      controller.isValidPassphrase('ability theme abandon abandon abandon abandon abandon abandon abandon abandon abandon absorb');
      expect(controller.valid).to.equal(1);
    });

    it('sets $scope.valid = 0 if value is invalid', () => {
      controller.isValidPassphrase('INVALID VALUE');
      expect(controller.valid).to.equal(0);
    });
  });
});

describe('save $mdDialog controller', () => {
  describe('constructor()', () => {
    it.skip('sets $watch on $ctrl.missing_input', () => {
    });
  });

  describe('next()', () => {
    it.skip('sets this.enter=true', () => {
    });

    it.skip('sets this.missing_word to a random word of passphrase', () => {
    });

    it.skip('sets this.pre to part of the passphrase before this.missing_word', () => {
    });

    it.skip('sets this.pos to part of the passphrase after this.missing_word', () => {
    });
  });

  describe('ok()', () => {
    it.skip('calls ok()', () => {
    });

    it.skip('calls this.close()', () => {
    });
  });

  describe('close()', () => {
    it.skip('calls this.$mdDialog.hide()', () => {
    });
  });
});
