const chai = require('chai');
const sinonChai = require('sinon-chai');

const expect = chai.expect;
chai.use(sinonChai);

describe('Header component', () => {
  let $compile;
  let $rootScope;
  let element;
  let $scope;

  beforeEach(angular.mock.module('app'));

  beforeEach(inject((_$compile_, _$rootScope_) => {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  beforeEach(() => {
    $scope = $rootScope.$new();

    element = $compile('<header></header>')($scope);
    $rootScope.logged = true;
    $scope.$digest();
  });

  const TRANSFER_BUTTON_TEXT = 'Transfer';
  it(`should contain "${TRANSFER_BUTTON_TEXT}" button if $root.logged`, () => {
    $rootScope.logged = true;
    $scope.$digest();
    expect(element.find('button.md-primary.transfer').text()).to.equal(TRANSFER_BUTTON_TEXT);
  });

  const LOGOUT_BUTTON_TEXT = 'Logout';
  it(`should contain "${LOGOUT_BUTTON_TEXT}" button if $root.logged`, () => {
    expect(element.find('button.logout').text()).to.equal(LOGOUT_BUTTON_TEXT);
  });
});

