const chai = require('chai');

const expect = chai.expect;

describe('Sign message component', () => {
  let $compile;
  let $rootScope;
  let element;
  let $scope;
  let account;

  beforeEach(angular.mock.module('app'));

  beforeEach(inject((_$compile_, _$rootScope_, _Account_) => {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    account = _Account_;
  }));

  beforeEach(() => {
    $scope = $rootScope.$new();
    account.set({
      passphrase: 'robust swift grocery peasant forget share enable convince deputy road keep cheap',
    });
    element = $compile('<sign-message></sign-message>')($scope);
    $scope.$digest();
  });

  const DIALOG_TITLE = 'Sign message';
  it(`should contain a title saying "${DIALOG_TITLE}"`, () => {
    expect(element.find('h2').text()).to.equal(DIALOG_TITLE);
  });

  it('should output signed message into textarea[name="result"] if there is input in textarea[name="message"]', () => {
    const message = 'Hello world';
    const result =
      '-----BEGIN LISK SIGNED MESSAGE-----\n' +
      '-----MESSAGE-----\n' +
      'Hello world\n' +
      '-----PUBLIC KEY-----\n' +
      '9d3058175acab969f41ad9b86f7a2926c74258670fe56b37c429c01fca9f2f0f\n' +
      '-----SIGNATURE-----\n' +
      'dd01775ec30225b24a74ee2ff9578ed3515371ddf32ba50540dc79a5dab66252081d0a345be3ad5d' +
      'fcb939f018d3dd911d9eacfe8998784879cc37fdfde1200448656c6c6f20776f726c64\n' +
      '-----END LISK SIGNED MESSAGE-----';
    const ngModelController = element.find('textarea[name="message"]').controller('ngModel');
    ngModelController.$setViewValue(message);
    expect(element.find('textarea[name="result"]').val()).to.equal(result);
  });
});

