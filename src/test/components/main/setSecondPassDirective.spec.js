const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const expect = chai.expect;
chai.use(sinonChai);

describe('setSecondPass Directive', () => {
  let $compile;
  let $scope;
  let $rootScope;
  let element;
  let setSecondPass;

  beforeEach(() => {
    // Load the myApp module, which contains the directive
    angular.mock.module('app')

    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    inject((_$compile_, _$rootScope_, _setSecondPass_) => {
      // The injector unwraps the underscores (_) from around the parameter names when matching
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      setSecondPass = _setSecondPass_;
      $scope = $rootScope.$new();
    });

    // Compile a piece of HTML containing the directive
    element = $compile('<button data-set-second-pass></button>')($scope);
    $scope.$digest();
  });

  describe('SetSecondPassLink', () => {
    it('Listens for broadcasting onAfterSignup', () => {
      const spy = sinon.spy($scope, 'passConfirmSubmit');
      $scope.$broadcast('onAfterSignup', {
        passphrase: 'TEST_VALUE',
        target: 'second-pass',
      });
      expect(spy).to.have.been.calledWith('TEST_VALUE');
    });

    it('binds click listener to call setSecondPass.show()', () => {
      const spy = sinon.spy(setSecondPass, 'show');
      element.triggerHandler('click');
      $scope.$digest();

      expect(spy).to.have.been.calledWith();
    });
  });

  describe('scope.passConfirmSubmit', () => {
    it('should call console.log', () => {
      const spy = sinon.spy(console, 'log');
      $scope.passConfirmSubmit();
      expect(spy).to.have.been.calledWith();
    });
  });
});
