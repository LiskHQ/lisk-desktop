const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const expect = chai.expect;
chai.use(sinonChai);

describe('Passphrase factory', () => {
  let $mdDialog;
  let setSecondPass;

  // Load the myApp module, which contains the directive
  beforeEach(angular.mock.module('app'));

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject((_setSecondPass_, _$mdDialog_) => {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $mdDialog = _$mdDialog_;
    setSecondPass = _setSecondPass_;
  }));

  describe('ok', () => {
    it('should call $mdDialog.hide()', () => {
      const spy = sinon.spy($mdDialog, 'hide');
      setSecondPass.ok();
      expect(spy).to.have.been.calledWith();
    });
  });

  describe('cancel', () => {
    it('should call $mdDialog.hide()', () => {
      const spy = sinon.spy($mdDialog, 'hide');
      setSecondPass.cancel();
      expect(spy).to.have.been.calledWith();
    });
  });

  describe('show', () => {
    it('should call $mdDialog.show()', () => {
      const spy = sinon.spy($mdDialog, 'show');
      setSecondPass.show();
      expect(spy).to.have.been.calledWith();
    });
  });
});
