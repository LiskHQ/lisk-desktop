const chai = require('chai');

const expect = chai.expect;

describe('Verify message component', () => {
  let $compile;
  let $rootScope;
  let element;
  let $scope;
  const publicKey = '9d3058175acab969f41ad9b86f7a2926c74258670fe56b37c429c01fca9f2f0f';
  const signature = 'dd01775ec30225b24a74ee2ff9578ed3515371ddf32ba50540dc79a5dab66252081d0a345be3ad5d' +
    'fcb939f018d3dd911d9eacfe8998784879cc37fdfde1200448656c6c6f20776f726c64';

  beforeEach(angular.mock.module('app'));

  beforeEach(inject((_$compile_, _$rootScope_) => {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  beforeEach(() => {
    $scope = $rootScope.$new();
    element = $compile('<verify-message></verify-message>')($scope);
    $scope.$digest();
  });

  const DIALOG_TITLE = 'Verify message';
  it(`should contain a title saying "${DIALOG_TITLE}"`, () => {
    expect(element.find('h2').text()).to.equal(DIALOG_TITLE);
  });

  it('should output original message into textarea[name="result"]', () => {
    const message = 'Hello world';
    const publicKeyModelController = element.find('input[name="publicKey"]').controller('ngModel');
    publicKeyModelController.$setViewValue(publicKey);
    const signaturModelController = element.find('textarea[name="signature"]').controller('ngModel');
    signaturModelController.$setViewValue(signature);
    expect(element.find('textarea[name="result"]').val()).to.equal(message);
  });

  it('should display error message "Invalid" if part of publicKey is misisng', () => {
    const publicKeyModelController = element.find('input[name="publicKey"]').controller('ngModel');
    publicKeyModelController.$setViewValue(publicKey.substr(0, 10));
    const signaturModelController = element.find('textarea[name="signature"]').controller('ngModel');
    signaturModelController.$setViewValue(signature);
    expect(element.find('div[ng-messages="$ctrl.publicKey.error"]').text()).to.equal('Invalid');
    expect(element.find('textarea[name="result"]').val()).to.equal('');
  });

  it('should display error message "Invalid" if part of signature is misisng', () => {
    const signaturModelController = element.find('textarea[name="signature"]').controller('ngModel');
    signaturModelController.$setViewValue(signature.substr(0, 100));
    const publicKeyModelController = element.find('input[name="publicKey"]').controller('ngModel');
    publicKeyModelController.$setViewValue(publicKey);
    expect(element.find('div[ng-messages="$ctrl.signature.error"]').text()).to.equal('Invalid');
    expect(element.find('textarea[name="result"]').val()).to.equal('');
  });
});

