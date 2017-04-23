const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const expect = chai.expect;
chai.use(sinonChai);

describe('setSecondPass Directive', () => {
  let $compile;
  let $scope;
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

  beforeEach(() => {
    $scope = $rootScope.$new();
    // Compile a piece of HTML containing the directive
    $compile('<button data-set-second-pass></button>')($scope);
    $scope.$digest();
  });

  describe('SetSecondPassLink', () => {
    it.skip('Listens for broadcasting onAfterSignup', () => {
      const spy = sinon.spy($scope, 'passConfirmSubmit');
      $scope.$broadcase('onAfterSignup', {
        passphrase: 'TEST_VALUE',
      });
      expect(spy).to.have.been.calledWith('TEST_VALUE');
    });
  });

  describe('scope.passConfirmSubmit', () => {
    it.skip('should call console.log', () => {
      const spy = sinon.spy(console, 'log');
      $scope.passConfirmSubmit.go();
      expect(spy).to.have.been.calledWith();
    });
  });
});
