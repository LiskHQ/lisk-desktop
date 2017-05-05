const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const expect = chai.expect;
chai.use(sinonChai);

describe('Header component', () => {
  let $compile;
  let $rootScope;
  let element;
  let $scope;
  let lsk;
  let account;

  beforeEach(angular.mock.module('app'));

  beforeEach(inject((_$compile_, _$rootScope_, _lsk_, _Account_) => {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    lsk = _lsk_;
    account = _Account_;
  }));

  beforeEach(() => {
    $scope = $rootScope.$new();

    element = $compile('<header></header>')($scope);
    $rootScope.logged = true;
    $scope.$digest();
  });

  const SEND_BUTTON_TEXT = 'Send';
  it(`should contain "${SEND_BUTTON_TEXT}" button if $root.logged`, () => {
    $rootScope.logged = true;
    $scope.$digest();
    expect(element.find('button.md-primary.send').text()).to.equal(SEND_BUTTON_TEXT);
  });

  const LOGOUT_BUTTON_TEXT = 'Logout';
  it(`should contain "${LOGOUT_BUTTON_TEXT}" button if $root.logged`, () => {
    expect(element.find('button.logout').text()).to.equal(LOGOUT_BUTTON_TEXT);
  });
});

