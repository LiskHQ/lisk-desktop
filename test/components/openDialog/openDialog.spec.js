const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const expect = chai.expect;
chai.use(sinonChai);

describe('Open dialog directive', () => {
  let $scope;
  let dialog;
  let compiled;
  const template = '<div><button type="button" data-open-dialog="send"></button></div>';

  beforeEach(angular.mock.module('app'));

  beforeEach(inject(($compile, $rootScope, _dialog_) => {
    $scope = $rootScope.$new();
    dialog = _dialog_;
    compiled = $compile(template)($scope);

    $scope.$digest();
  }));

  it('should render directive', () => {
    const el = compiled.find('button');
    expect(el.length).to.equal(1);
  });

  it('should run dialog.modal() when clicked', () => {
    const el = compiled.find('button');
    const spy = sinon.spy(dialog, 'modal');
    el.triggerHandler('click');
    expect(spy).to.have.been.calledWith();
  });
});
