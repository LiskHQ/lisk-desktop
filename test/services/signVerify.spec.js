const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);

describe('Factory: signVerify', () => {
  let signVerify;
  let $mdDialog;

  beforeEach(angular.mock.module('app'));

  beforeEach(inject((_signVerify_, _$mdDialog_) => {
    signVerify = _signVerify_;
    $mdDialog = _$mdDialog_;
  }));

  describe('openSignMessageDialog(account, passphrase)', () => {
    let mock;

    beforeEach(() => {
      mock = sinon.mock($mdDialog);
      mock.expects('show').withArgs();
    });

    it('opens a $mdDialog', () => {
      signVerify.openSignMessageDialog();
    });
  });

  describe('openVerifyMessageDialog()', () => {
    let mock;

    beforeEach(() => {
      mock = sinon.mock($mdDialog);
      mock.expects('show').withArgs();
    });

    it('opens a $mdDialog', () => {
      signVerify.openVerifyMessageDialog();
    });
  });
});

