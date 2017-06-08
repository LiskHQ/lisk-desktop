const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const expect = chai.expect;
chai.use(sinonChai);

describe('Delegate registration component', () => {
  let $scope;
  const template = '<delegate-registration></delegate-registration>';
  const form = {
    $setPristine: () => {},
    $setUntouched: () => {},
    valid: true,
  };

  beforeEach(angular.mock.module('app'));

  beforeEach(inject(($compile, $rootScope) => {
    const scope = $rootScope.$new();
    $compile(template)(scope);
    scope.$digest();
    $scope = scope.$$childTail;
  }));

  it('defines a cancel method to hide modal and reset the form', () => {
    const spyReset = sinon.spy($scope, 'reset');

    expect($scope.cancel).to.not.equal(undefined);
    $scope.cancel(form);
    $scope.$digest();

    expect(spyReset).to.have.been.calledWith();
  });

  it('defines a reset method to reset the form and form values', () => {
    const spyPristine = sinon.spy(form, '$setPristine');
    const spyUntouched = sinon.spy(form, '$setUntouched');

    expect($scope.reset).to.not.equal(undefined);

    $scope.form.name = 'TEST_NAME';
    $scope.form.error = 'TEST_ERROR';
    $scope.reset(form);
    $scope.$digest();

    expect($scope.form.name).to.equal('');
    expect($scope.form.error).to.equal('');
    expect(spyPristine).to.have.been.calledWith();
    expect(spyUntouched).to.have.been.calledWith();
  });
});
