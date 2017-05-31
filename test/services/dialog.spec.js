const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);
chai.should();

describe('Factory: dialog', () => {
  let $mdToast;
  let $mdDialog;

  beforeEach(angular.mock.module('app'));

  beforeEach(inject((_$mdToast_, _$mdDialog_) => {
    $mdToast = _$mdToast_;
    $mdDialog = _$mdDialog_;
  }));

  describe('modal(component, options)', () => {
    it('opens a $mdDialog', () => {
      let mock = sinon.mock($mdDialog);
      dialog.modal();
      mock.expects('show').withArgs();
    });

    it.skip('only accepts a non empty string as component', () => {
      component.should.be.a('string');
    })
  });
});
