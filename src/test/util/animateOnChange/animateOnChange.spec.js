describe('animate-on-change directive', () => {
  let $compile,
    $rootScope,
    element;

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
    $rootScope.byte = '00';
    element = $compile('<span animate-on-change="byte"></span>')($rootScope);
    $rootScope.$digest();
  });

  it('adds class "change" to the element on change of the attribtde', () => {
    expect(element.hasClass('change')).to.equal(false);
    $rootScope.byte = '01';
    $rootScope.$digest();
    expect(element.hasClass('change')).to.equal(true);
  });
});

