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

