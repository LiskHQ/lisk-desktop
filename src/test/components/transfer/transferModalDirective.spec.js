const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const expect = chai.expect;
chai.use(sinonChai);

describe('Transfer modal directive', () => {
  let $scope;
  let TransferModal;
  let compiled;
  const template = '<div><button type="button" data-show-transfer-modal=""></button></div>';

  beforeEach(angular.mock.module('app'));

  beforeEach(inject(($compile, $rootScope, _TransferModal_) => {
    $scope = $rootScope.$new();
    TransferModal = _TransferModal_;
    compiled = $compile(template)($scope);

    $scope.$digest();
  }));

  afterEach(() => {
    if (typeof TransferModal.show.restore === 'function') {
      TransferModal.show.restore();
    }
  });

  it('should render directive', () => {
    const el = compiled.find('button');
    expect(el.length).to.equal(1);
  });

  it('should run TransferModal.show() when clicked', () => {
    const el = compiled.find('button');
    const spy = sinon.spy(TransferModal, 'show');
    el.triggerHandler('click');
    expect(spy).to.have.been.calledWith();
  });
});
