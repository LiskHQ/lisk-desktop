const chai = require('chai');

const expect = chai.expect;

describe('Top component', () => {
  let $compile;
  let $rootScope;

  // Load the myApp module, which contains the directive
  beforeEach(angular.mock.module('app'));

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject((_$compile_, _$rootScope_) => {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('should contain address', () => {
    // Compile a piece of HTML containing the directive
    const element = $compile('<top></top>')($rootScope);
    // Fire all the watches, so the scope expression {{1 + 1}} will be evaluated
    $rootScope.$digest();
    // Check that the compiled element contains the templated content
    expect(element.html()).to.contain('address');
  });
});
