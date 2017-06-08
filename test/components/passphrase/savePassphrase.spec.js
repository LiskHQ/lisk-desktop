const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const expect = chai.expect;
chai.use(sinonChai);
const PASSPHRASE = 'illegal symbol search tree deposit youth mixture craft amazing tool soon unit';

describe('Save passphrase component', () => {
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
    $scope.passphrase = PASSPHRASE;
    $scope.label = 'Save';
    $scope.onSave = () => {};
    element = $compile('<save-passphrase data-passphrase="passphrase" data-label="label" data-on-save="onSave"></save-passphrase>')($scope);
    $scope.$digest();
  });

  it('should contain an input field with the passphrase', () => {
    expect(element.find('textarea').val()).to.equal(PASSPHRASE);
  });

  it('should ask for a missing word when "yes-its-save-button" clicked', () => {
    element.find('.yes-its-save-button').click();
    expect(element.find('label').text()).to.equal('Enter the missing word');
  });

  describe('Save passphrase component controller', () => {
    let controller;
    let $componentController;
    let dialogMock;

    beforeEach(inject((_$componentController_) => {
      $componentController = _$componentController_;
    }));

    beforeEach(() => {
      $scope = $rootScope.$new();
      $scope.passphrase = PASSPHRASE;
      controller = $componentController('savePassphrase', $scope, {
        onSave: () => {},
        label: 'Save',
      });
      dialogMock = sinon.mock(controller.$mdDialog);
    });

    afterEach(() => {
      dialogMock.verify();
      dialogMock.restore();
    });

    describe('ok()', () => {
      it('calls $mdDialog.hide', () => {
        dialogMock.expects('hide');
        controller.ok();
      });
    });

    describe('close()', () => {
      it('calls $mdDialog.cancel', () => {
        dialogMock.expects('cancel');
        controller.close();
      });
    });
  });
});

