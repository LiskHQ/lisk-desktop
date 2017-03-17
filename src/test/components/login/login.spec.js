describe('Login component', function() {
  var $compile,
      $rootScope;

  // Load the myApp module, which contains the directive
  beforeEach(angular.mock.module("app"));

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_$compile_, _$rootScope_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('should contain header', function() {
    // Compile a piece of HTML containing the directive
    var element = $compile("<login></login>")($rootScope);
    $rootScope.$digest();
    expect(element.html()).to.contain("Sign In");
  });
});

describe('Login controller', function() {
  beforeEach(angular.mock.module("app"));

  var $controller,
      $rootScope;

  beforeEach(inject(function(_$componentController_, _$rootScope_){
    $componentController = _$componentController_;
    $rootScope = _$rootScope_;
  }));

  describe('$scope.emptyBytes', function() {
    it('it returns array of 12 zeros', function() {
      var $scope = $rootScope.$new();
      var controller = $componentController('login', $scope, { });
      expect(controller.emptyBytes()).to.equal([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    });
  });

  describe('$scope.isValid(value)', function() {
    var $scope,
        controller;

    beforeEach(function() {
      $scope = $rootScope.$new();
      controller = $componentController('login', $scope, { });
    });

    it('sets $scope.valid = 2 if  value is empty', function() {
      controller.isValid('');
      expect(controller.valid).to.equal(2);
    });

    it('sets $scope.valid = 1 if value is valid', function() {
      controller.isValid('ability theme abandon abandon abandon abandon abandon abandon abandon abandon abandon absorb');
      expect(controller.valid).to.equal(1);
    });

    it('sets $scope.valid = 0 if value is invalid', function() {
      controller.isValid('INVALID VALUE');
      expect(controller.valid).to.equal(0);
    });
  });
});
