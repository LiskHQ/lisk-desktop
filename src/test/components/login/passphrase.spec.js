const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const expect = chai.expect;
chai.use(sinonChai);

describe('Passphrase Directive', () => {
  let $compile;
  let $scope;
  let $rootScope;
  let $document;
  let Passphrase;

  beforeEach(() => {
    // Load the myApp module, which contains the directive
    angular.mock.module('app');

    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    inject((_$compile_, _$rootScope_, _$document_, _Passphrase_) => {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      $document = _$document_;
      Passphrase = _Passphrase_;
      $scope = $rootScope.$new();
    });

    // Compile a piece of HTML containing the directive
    $compile('<div><passphrase data-target="primary-pass"></passphrase></div>')($scope);
    $scope.$digest();
  });

  describe('PassphraseLink', () => {
    it.skip('should intiate Passphrase service', () => {
      expect(Passphrase.init).called();
    });

    it.skip('should asign progress to its own $scope', () => {
      expect($scope.progress).to.not.equal(undefined);
      expect($scope.progress).to.equal(Passphrase.progress);
    });
  });

  describe('$scope.simulateMousemove()', () => {
    it.skip('calls $document.mousemove()', () => {
      const spy = sinon.spy($document, 'mousemove');
      $scope.simulateMousemove();
      expect(spy).to.have.been.calledWith();
    });
  });

  describe('$scope.mobileAndTabletcheck()', () => {
    it.skip('checks if the useAgent is a device', () => {
      const agents = [
        'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25',
        'Mozilla/5.0 (iPad; CPU OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25',
      ];
      let isDevice = true;
      agents.forEach(agent => isDevice = isDevice && $scope.mobileAndTabletcheck(agent));
      expect(isDevice).to.equal(true);
    });
  });
});
