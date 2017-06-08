const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const expect = chai.expect;
chai.use(sinonChai);

describe('setSecondPass component', () => {
  let $compile;
  let $scope;
  let $rootScope;
  let accountApi;
  let $q;
  let dialog;

  beforeEach(() => {
    // Load the myApp module, which contains the directive
    angular.mock.module('app');

    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    inject((_$compile_, _$rootScope_, _AccountApi_, _$q_, _dialog_) => {
      // The injector unwraps the underscores (_) from around the parameter names when matching
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      accountApi = _AccountApi_;
      $q = _$q_;
      dialog = _dialog_;
      const scope = $rootScope.$new();

      $compile('<set-second-pass></set-second-pass>')(scope);
      scope.$digest();

      $scope = scope.$$childTail;
    });
  });

  describe('scope.passConfirmSubmit', () => {
    it('should call accountApi.setSecondSecret', () => {
      const testPassphrase = 'glow two glimpse camp aware tip brief confirm similar code float defense';
      const mock = sinon.mock(accountApi);
      const deffered = $q.defer();
      mock.expects('setSecondSecret').returns(deffered.promise);

      const spy = sinon.spy(dialog, 'successAlert');
      $scope.passConfirmSubmit(testPassphrase);

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
