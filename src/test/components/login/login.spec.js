var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var expect = chai.expect;
chai.use(sinonChai);

describe('Login component', function() {
  var $compile,
      $rootScope,
      element;

  // Load the myApp module, which contains the directive
  beforeEach(angular.mock.module("app"));

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_$compile_, _$rootScope_) {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
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
      $rootScope;

  beforeEach(inject(function(_$componentController_, _$rootScope_) {
    $componentController = _$componentController_;
    $rootScope = _$rootScope_;
  }));

  describe('$scope.reset()', function() {
    var $scope,
        controller;

    beforeEach(function() {
      $scope = $rootScope.$new();
      controller = $componentController('login', $scope, {});
    });

    it('makes input_passphrase empty', function() {
      passphrase = 'TEST';
      controller.input_passphrase = passphrase;
      expect(controller.input_passphrase).to.equal(passphrase);
      controller.reset();
      expect(controller.input_passphrase).to.equal('');
    });
  });

  describe('$scope.setNewPassphrase()', function() {
    var $scope,
        controller;

    beforeEach(function() {
      $scope = $rootScope.$new();
      controller = $componentController('login', $scope, {});
    });

    it('opens a material design dialog', function() {
      var seed = ['23', '34', '34', '34', '34', '34', '34', '34'];
      var dialogSpy = sinon.spy(controller.$mdDialog, 'show');
      controller.setNewPassphrase(seed);
      expect(dialogSpy).to.have.been.calledWith();
    });
  });

  describe('$scope.isValidPassphrase(value)', function() {
    var $scope,
        controller;

    beforeEach(function() {
      $scope = $rootScope.$new();
      controller = $componentController('login', $scope, {});
    });

    it('sets $scope.valid = 2 if value is empty', function() {
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
