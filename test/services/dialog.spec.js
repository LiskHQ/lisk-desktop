const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);
chai.should();

describe('Factory: dialog', () => {
  let $mdDialog;
  let dialog;
  const component = 'send';
  beforeEach(angular.mock.module('app'));

  beforeEach(inject((_$mdDialog_, _dialog_) => {
    $mdDialog = _$mdDialog_;
    dialog = _dialog_;
  }));

  describe('modal(component, options)', () => {
    it('opens a $mdDialog', () => {
      const mock = sinon.mock($mdDialog);
      dialog.modal();
      mock.expects('show').withArgs();
    });

    it.skip('only accepts a non empty string as component', () => {
      component.should.be.a('string');
    });
  });
});
