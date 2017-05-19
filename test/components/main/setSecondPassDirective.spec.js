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
  let accountApi;
  let setSecondPass;
  let $q;
  let dialog;

  beforeEach(() => {
    // Load the myApp module, which contains the directive
    angular.mock.module('app');

    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    inject((_$compile_, _$rootScope_, _setSecondPass_, _AccountApi_, _$q_, _dialog_) => {
      // The injector unwraps the underscores (_) from around the parameter names when matching
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      setSecondPass = _setSecondPass_;
      accountApi = _AccountApi_;
      $q = _$q_;
      dialog = _dialog_;
      $scope = $rootScope.$new();
    });

    // Compile a piece of HTML containing the directive
    element = $compile('<button data-set-second-pass></button>')($scope);
    $scope.$digest();
  });

  describe('SetSecondPassLink', () => {
    it('listens for an onAfterSignup event', () => {
      const mock = sinon.mock(accountApi);
      const deffered = $q.defer();
      mock.expects('setSecondSecret').returns(deffered.promise);

      const spy = sinon.spy(dialog, 'successAlert');

      $scope.$broadcast('onAfterSignup', {
        passphrase: 'TEST_VALUE',
        target: 'second-pass',
      });

      deffered.resolve({});
      $scope.$apply();

      expect(spy).to.have.been.calledWith();
    });

    it('binds click listener to call setSecondPass.show()', () => {
      const spy = sinon.spy(setSecondPass, 'show');
      element.triggerHandler('click');
      $scope.$digest();

      expect(spy).to.have.been.calledWith();
    });
  });

  describe('scope.passConfirmSubmit', () => {
    it('should call accountApi.setSecondSecret', () => {
      const mock = sinon.mock(accountApi);
      const deffered = $q.defer();
      mock.expects('setSecondSecret').returns(deffered.promise);

      const spy = sinon.spy(dialog, 'successAlert');
      $scope.passConfirmSubmit();

      deffered.resolve({});
      $scope.$apply();

      expect(spy).to.have.been.calledWith();
    });

    it('should show error dialog if trying to set second passphrase multiple times', () => {
      const mock = sinon.mock(accountApi);
      const deffered = $q.defer();
      mock.expects('setSecondSecret').returns(deffered.promise);

      const spy = sinon.spy(dialog, 'errorAlert');
      $scope.passConfirmSubmit();

      deffered.reject({ message: 'Missing sender second signature' });
      $scope.$apply();
      expect(spy).to.have.been.calledWith();

      deffered.reject({ message: 'Account does not have enough LSK : TEST_ADDRESS' });
      $scope.$apply();
      expect(spy).to.have.been.calledWith();

      deffered.reject({ message: 'OTHER MESSAGE' });
      $scope.$apply();
      expect(spy).to.have.been.calledWith();
    });

    it('should show error dialog if account does not have enough LSK', () => {
      const mock = sinon.mock(accountApi);
      const deffered = $q.defer();
      mock.expects('setSecondSecret').returns(deffered.promise);

      const spy = sinon.spy(dialog, 'errorAlert');
      $scope.passConfirmSubmit();

      deffered.reject({ message: 'Missing sender second signature' });
      $scope.$apply();
      expect(spy).to.have.been.calledWith();
    });

    it('should show error dialog for all the other errors', () => {
      const mock = sinon.mock(accountApi);
      const deffered = $q.defer();
      mock.expects('setSecondSecret').returns(deffered.promise);

      const spy = sinon.spy(dialog, 'errorAlert');
      $scope.passConfirmSubmit();

      deffered.reject({ message: 'Other messages' });
      $scope.$apply();
      expect(spy).to.have.been.calledWith();
    });
  });
});
