const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const expect = chai.expect;
chai.use(sinonChai);

describe('Send modal directive', () => {
  let $scope;
  let SendModal;
  let compiled;
  const template = '<div><button type="button" data-show-send-modal=""></button></div>';

  beforeEach(angular.mock.module('app'));

  beforeEach(inject(($compile, $rootScope, _SendModal_) => {
    $scope = $rootScope.$new();
    SendModal = _SendModal_;
    compiled = $compile(template)($scope);

    $scope.$digest();
  }));

  afterEach(() => {
    if (typeof SendModal.show.restore === 'function') {
      SendModal.show.restore();
    }
  });

  it('should render directive', () => {
    const el = compiled.find('button');
    expect(el.length).to.equal(1);
  });

  it('should run SendModal.show() when clicked', () => {
    const el = compiled.find('button');
    const spy = sinon.spy(SendModal, 'show');
    el.triggerHandler('click');
    expect(spy).to.have.been.calledWith();
  });
});
