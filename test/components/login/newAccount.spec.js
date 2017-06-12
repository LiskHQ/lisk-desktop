const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const expect = chai.expect;
chai.use(sinonChai);
const VALID_PASSPHRASE = 'illegal symbol search tree deposit youth mixture craft amazing tool soon unit';

describe('newAccount component', () => {
  let $compile;
  let $rootScope;
  let $scope;
  let element;

  // Load the myApp module, which contains the directive
  beforeEach(angular.mock.module('app'));

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject((_$compile_, _$rootScope_) => {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  beforeEach(() => {
    $scope = $rootScope.$new();
    $scope.network = {
      name: 'Mainnet',
    };
    // Compile a piece of HTML containing the directive
    element = $compile('<new-account data-network="network"></new-account>')($scope);
    $scope.$digest();
  });

  const MODAL_TITLE_TEXT = 'New Account';
  it(`should contain a heading saying "${MODAL_TITLE_TEXT}"`, () => {
    expect(element.find('.dialog-primary md-toolbar h2').text()).to.equal(MODAL_TITLE_TEXT);
  });

  const NEXT_BUTTON_TEXT = 'Next';
  it(`should contain a button titled "${NEXT_BUTTON_TEXT}"`, () => {
    expect(element.find('.next-button span.ng-scope').text()).to.equal(NEXT_BUTTON_TEXT);
  });
});

describe('newAccount controller', () => {
  beforeEach(angular.mock.module('app'));

  let $rootScope;
  let $scope;
  let $state;
  let $componentController;
  /* eslint-enable no-unused-vars */
  let $q;
  let peers;

  beforeEach(inject((_$componentController_, _$rootScope_, _$state_, _$q_, _Peers_) => {
    $componentController = _$componentController_;
    $rootScope = _$rootScope_;
    /* eslint-enable no-unused-vars */
    $q = _$q_;
    peers = _Peers_;
    $state = _$state_;
  }));

  beforeEach(() => {
    const scope = $rootScope.$new();
    $componentController('newAccount', scope, {
      network: { name: 'Mainnet' },
    });
    scope.$digest();
    $scope = scope.$scope;
  });

  describe('passConfirmSubmit()', () => {
    let peersMock;
    let deferred;

    beforeEach(() => {
      deferred = $q.defer();
      peersMock = sinon.mock(peers);
      peersMock.expects('setActive').returns(deferred.promise);
      peers.online = true;
    });

    it('redirects to main if passphrase is valid', () => {
      const spy = sinon.spy($state, 'go');
      $scope.passConfirmSubmit(VALID_PASSPHRASE);
      deferred.resolve();
      $scope.$apply();
      expect(spy).to.have.been.calledWith();
    });
  });

  describe('onSave()', () => {
    it('calls the passConfirmSubmit with the generated passphrase', () => {
      const spy = sinon.spy($scope, 'passConfirmSubmit');
      $scope.onSave(VALID_PASSPHRASE);
      expect(spy).to.have.been.calledWith(VALID_PASSPHRASE);
    });
  });
});
