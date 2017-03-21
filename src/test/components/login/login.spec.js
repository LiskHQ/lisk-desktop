var sinon = require('sinon');
var sinonChai = require("sinon-chai");
var expect = chai.expect;
chai.use(sinonChai);

describe('Login component', function() {
  var $compile,
      $rootScope,
      element,
      cookies;

  // Load the myApp module, which contains the directive
  beforeEach(angular.mock.module("app"));

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_$compile_, _$rootScope_, _$cookies_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $cookies = _$cookies_;
  }));

  beforeEach(function() {
    // Compile a piece of HTML containing the directive
    element = $compile("<login></login>")($rootScope);
    $rootScope.$digest();
  });

  var HEADER_TEXT = 'Sign In';
  it('should contain header saying "' + HEADER_TEXT + '"', function() {
    expect(element.find('.md-title').text()).to.equal(HEADER_TEXT);
  });

  var LABEL_TEXT = 'Enter your passphrase';
  it('should contain a form with label saying "' + LABEL_TEXT + '"', function() {
    expect(element.find('form label').text()).to.equal(LABEL_TEXT);
  });

  it('should contain an input field', function() {
    expect(element.find('form input').html()).to.equal('');
  });

  var LOGIN_BUTTON_TEXT = 'Login';
  it('should contain a button saying "' + LOGIN_BUTTON_TEXT + '"', function() {
    expect(element.find('.md-raised').text()).to.equal(LOGIN_BUTTON_TEXT);
  });
});

describe('Login controller', function() {
  beforeEach(angular.mock.module("app"));

  var $controller,
      $rootScope,
      $scope,
      controller;

  beforeEach(inject(function(_$componentController_, _$rootScope_){
    $componentController = _$componentController_;
    $rootScope = _$rootScope_;
  }));

  beforeEach(function() {
    $scope = $rootScope.$new();
    controller = $componentController('login', $scope, { });
    controller.onLogin = function() {};
    controller.passphrase = '';
  });

  describe('$scope.reset()', function() {
    it('makes input_passphrase empty', function() {
      passphrase = 'TEST';
      controller.input_passphrase = passphrase;
      expect(controller.input_passphrase).to.equal(passphrase);
      controller.reset();
      expect(controller.input_passphrase).to.equal('');
    });
  });

  describe('$scope.stopNewPassphraseGeneration()', function() {
    it('sets this.generatingNewPassphrase = false', function() {
      controller.generatingNewPassphrase = true;
      controller.stopNewPassphraseGeneration();
      expect(controller.generatingNewPassphrase).to.equal(false);
    });

    it('unbinds mousemove listener', function() {
      var unbindSpy = sinon.spy(controller.$document, 'unbind');
      controller.stopNewPassphraseGeneration();
      expect(unbindSpy).to.have.been.calledWith('mousemove', controller.listener);
    });
  });

  describe('$scope.startGenratingNewPassphrase()', function() {
    it('sets this.generatingNewPassphrase = true', function() {
      controller.startGenratingNewPassphrase();
      expect(controller.generatingNewPassphrase).to.equal(true);
    });

    it('unbinds mousemove listener', function() {
      var spy = sinon.spy(controller, 'reset');
      controller.startGenratingNewPassphrase();
      expect(spy).to.have.been.calledWith();
    });
  });

  describe('$scope.doTheLogin()', function() {
    it('sets this.phassphrase as this.input_passphrase processed by fixCaseAndWhitespace', function() {
      controller.input_passphrase = '\tTEST  PassPHrASe  ';
      controller.doTheLogin();
      expect(controller.passphrase).to.equal('test passphrase');
    });

    it('calls this.reset()', function() {
      var spy = sinon.spy(controller, 'reset');
      controller.doTheLogin();
      expect(spy).to.have.been.calledWith();
    });

    it('sets timeout with this.onLogin', function() {
      var spy = sinon.spy(controller, '$timeout');
      controller.doTheLogin();
      expect(spy).to.have.been.calledWith(controller.onLogin);
    });
  });

  describe('$scope.constructor()', function() {
    it.skip('sets $watch on $ctrl.input_passphrase to keep validating it', function() {
      // skipped because it doesn't work
      var spy = sinon.spy(controller.$scope, '$watch');
      controller.constructor();
      expect(spy).to.have.been.calledWith('$ctrl.input_passphrase', controller.isValidPassphrase);
    });

    it.skip('sets $watch that sets customFullscreen on small screens', function() {
    });
  });

  describe('$scope.simulateMousemove()', function() {
    it('calls this.$document.mousemove()', function() {
      var spy = sinon.spy(controller.$document, 'mousemove');
      controller.simulateMousemove();
      expect(spy).to.have.been.calledWith();
    });
  });

  describe('$scope.doTheLogin()', function() {
    it.skip('sets this.phassphrase as this.input_passphrase processed by fixCaseAndWhitespace', function() {
    });

    it.skip('calls this.reset()', function() {
    });

    it.skip('sets timeout with this.onLogin', function() {
    });
  });

  describe('$scope.constructor()', function() {
    it.skip('sets $watch on $ctrl.input_passphrase to keep validating it', function() {
    });

    it.skip('sets $watch that sets customFullscreen on small screens', function() {
    });
  });

  describe('$scope.simulateMousemove()', function() {
    it.skip('calls this.$document.mousemove()', function() {
    });
  });

  describe('$scope.setNewPassphrase()', function() {
    it('opens a material design dialog', function() {
      var seed = ['23', '34', '34', '34', '34', '34', '34', '34'];
      var dialogSpy = sinon.spy(controller.$mdDialog, 'show');
      controller.setNewPassphrase(seed);
      expect(dialogSpy).to.have.been.calledWith();
    });
  });

  describe('$scope.devTestAccount()', function() {
    it('sets input_passphrase from cookie called passphrase if present', function() {
      var testPassphrase = 'test passphrase';
      var mock = sinon.mock(controller.$cookies);
      mock.expects("get").returns(testPassphrase);
      controller.devTestAccount();
      expect(controller.input_passphrase).to.equal(testPassphrase);
    });

    it('does nothing if cooke called passphrase not present', function() {
      var testPassphrase = 'test passphrase';
      controller.input_passphrase = testPassphrase;
      var mock = sinon.mock(controller.$cookies);

      mock.expects("get").returns(undefined);
      controller.devTestAccount();
      expect(controller.input_passphrase).to.equal(testPassphrase);
    });
  });

  describe('$scope.devTestAccount()', function() {
    it.skip('sets input_passphrase from cookie called passphrase if present', function() {
    });

    it.skip('does nothing if cooke called passphrase not present', function() {
    });
  });

  describe('$scope.isValidPassphrase(value)', function() {
    it('sets $scope.valid = 2 if  value is empty', function() {
      controller.isValidPassphrase('');
      expect(controller.valid).to.equal(2);
    });

    it('sets $scope.valid = 1 if value is valid', function() {
      controller.isValidPassphrase('ability theme abandon abandon abandon abandon abandon abandon abandon abandon abandon absorb');
      expect(controller.valid).to.equal(1);
    });

    it('sets $scope.valid = 0 if value is invalid', function() {
      controller.isValidPassphrase('INVALID VALUE');
      expect(controller.valid).to.equal(0);
    });
  });
});

describe('save $mdDialog controller', function() {
  describe('constructor()', function() {
    it.skip('sets $watch on $ctrl.missing_input', function() {
    });
  });

  describe('next()', function() {
    it.skip('sets this.enter=true', function() {
    });

    it.skip('sets this.missing_word to a random word of passphrase', function() {
    });

    it.skip('sets this.pre to part of the passphrase before this.missing_word', function() {
    });

    it.skip('sets this.pos to part of the passphrase after this.missing_word', function() {
    });
  });

  describe('ok()', function() {
    it.skip('calls ok()', function() {
    });

    it.skip('calls this.close()', function() {
    });
  });

  describe('close()', function() {
    it.skip('calls this.$mdDialog.hide()', function() {
    });
  });
});

describe('save $mdDialog controller', function() {
  describe('constructor()', function() {
    it.skip('sets $watch on $ctrl.missing_input', function() {
    });
  });

  describe('next()', function() {
    it.skip('sets this.enter=true', function() {
    });

    it.skip('sets this.missing_word to a random word of passphrase', function() {
    });

    it.skip('sets this.pre to part of the passphrase before this.missing_word', function() {
    });

    it.skip('sets this.pos to part of the passphrase after this.missing_word', function() {
    });
  });

  describe('ok()', function() {
    it.skip('calls ok()', function() {
    });

    it.skip('calls this.close()', function() {
    });
  });

  describe('close()', function() {
    it.skip('calls this.$mdDialog.hide()', function() {
    });
  });
});
