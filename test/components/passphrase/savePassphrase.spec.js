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
    element = $compile('<save-passphrase passphrase="passphrase"></save-passphrase>')($scope);
    $rootScope.$digest();
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
    let stateMock;

    beforeEach(inject((_$componentController_) => {
      $componentController = _$componentController_;
    }));

    beforeEach(() => {
      $scope = $rootScope.$new();
      $scope.passphrase = PASSPHRASE;
      controller = $componentController('savePassphrase', $scope, {});

      dialogMock = sinon.mock(controller.$mdDialog);
      stateMock = sinon.mock(controller.$state);
    });

    afterEach(() => {
      dialogMock.verify();
      dialogMock.restore();
      stateMock.verify();
      stateMock.restore();
    });

    describe('ok()', () => {
      it('calls $mdDialog.hide and $state.reload', () => {
        dialogMock.expects('hide');
        stateMock.expects('reload');

        controller.ok();
      });
    });

    describe('close()', () => {
      it('calls $mdDialog.cancel and $state.reload', () => {
        dialogMock.expects('cancel');
        stateMock.expects('reload');

        controller.close();
      });
    });
  });
});

