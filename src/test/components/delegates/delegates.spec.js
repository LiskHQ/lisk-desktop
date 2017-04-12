const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const expect = chai.expect;
chai.use(sinonChai);

describe('Delegates component', () => {
  let $compile;
  let $rootScope;
  let element;
  let $scope;
  let $peers;
  let lsk;

  beforeEach(angular.mock.module('app'));

  beforeEach(inject((_$compile_, _$rootScope_, _$peers_, _lsk_) => {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $peers = _$peers_;
    lsk = _lsk_;
  }));

  beforeEach(() => {
    $peers.active = { sendRequest() {} };
    const mock = sinon.mock($peers.active);
    mock.expects('sendRequest').withArgs('accounts/delegates').callsArgWith(2, {
      success: true,
      delegates: Array.from({ length: 10 }, (v, k) => ({
        username: `genesis_${k}`,
      })),
    });
    mock.expects('sendRequest').withArgs('delegates/').callsArgWith(2, {
      success: true,
      delegates: Array.from({ length: 100 }, (v, k) => ({
        username: `genesis_${k}`,
      })),
    });

    $scope = $rootScope.$new();
    $scope.passphrase = 'robust swift grocery peasant forget share enable convince deputy road keep cheap';
    $scope.account = {
      address: '8273455169423958419L',
      balance: lsk.from(100),
    };
    element = $compile('<delegates passphrase="passphrase" account="account"></delegates>')($scope);
    $scope.$digest();
  });

  const BUTTON_LABEL = 'Vote';
  it(`should contain button saying "${BUTTON_LABEL}"`, () => {
    expect(element.find('md-card-title button').text()).to.contain(BUTTON_LABEL);
  });
});
