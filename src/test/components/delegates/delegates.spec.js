const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const expect = chai.expect;
chai.use(sinonChai);

describe('Delegates component', () => {
  let $compile;
  let $rootScope;
  let element;
  let $scope;
  let $peers;
  let lsk;

  beforeEach(angular.mock.module('app'));

  beforeEach(inject((_$compile_, _$rootScope_, _$peers_, _lsk_) => {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $peers = _$peers_;
    lsk = _lsk_;
  }));

  beforeEach(() => {
    $peers.active = { sendRequest() {} };
    const mock = sinon.mock($peers.active);
    mock.expects('sendRequest').withArgs('accounts/delegates').callsArgWith(2, {
      success: true,
      delegates: Array.from({ length: 10 }, (v, k) => ({
        username: `genesis_${k}`,
      })),
    });
    mock.expects('sendRequest').withArgs('delegates/').callsArgWith(2, {
      success: true,
      delegates: Array.from({ length: 100 }, (v, k) => ({
        username: `genesis_${k}`,
      })),
    });

    $scope = $rootScope.$new();
    $scope.passphrase = 'robust swift grocery peasant forget share enable convince deputy road keep cheap';
    $scope.account = {
      address: '8273455169423958419L',
      balance: lsk.from(100),
    };
    element = $compile('<delegates passphrase="passphrase" account="account"></delegates>')($scope);
    $scope.$digest();
  });

  const BUTTON_LABEL = 'Vote';
  it(`should contain button saying "${BUTTON_LABEL}"`, () => {
    expect(element.find('md-card-title button').text()).to.contain(BUTTON_LABEL);
  });
});

describe('delegates component controller', () => {
  beforeEach(angular.mock.module('app'));

  let $rootScope;
  let $scope;
  let controller;
  let $componentController;
  let activePeerMock;
  let $peers;
  let delegates;

  beforeEach(inject((_$componentController_, _$rootScope_, _$peers_) => {
    $componentController = _$componentController_;
    $rootScope = _$rootScope_;
    $peers = _$peers_;
  }));

  beforeEach(() => {
    delegates = Array.from({ length: 100 }, (v, k) => ({
      username: `genesis_${k}`,
    }));

    $peers.active = { sendRequest() {} };
    activePeerMock = sinon.mock($peers.active);

    $scope = $rootScope.$new();
    controller = $componentController('delegates', $scope, {
      account: {
        address: '8273455169423958419L',
        balance: '10000',
      },
    });
    controller.delegates = delegates;
    controller.voteList = delegates.slice(1, 3);
    controller.delegatesTotalCount = delegates.length + 100;
  });

  describe('constructor()', () => {
    it('sets $watch on $scope.search that fetches delegates matching the search term', () => {
      activePeerMock.expects('sendRequest').withArgs('delegates/search').callsArgWith(2, {
        success: true,
        delegates,
      });
      controller.$scope.$digest();
      controller.$scope.search = 'genesis_42';
      controller.$scope.$digest();
    });

    it('sets to run this.updateALl() $on "peerUpdate" is $emited', () => {
      const mock = sinon.mock(controller);
      mock.expects('updateAll').withArgs();
      controller.$scope.$emit('peerUpdate');
      mock.verify();
      mock.restore();
    });
  });

  describe('showMore()', () => {
    it('increases this.delegatesDisplayedCount by 20 if this.delegatesDisplayedCount < this.delegates.length', () => {
      const initialCount = controller.delegatesDisplayedCount;
      controller.showMore();
      expect(controller.delegatesDisplayedCount).to.equal(initialCount + 20);
    });

    it('fetches more delegates if this.delegatesDisplayedCount - this.delegates.length <= 20', () => {
      activePeerMock.expects('sendRequest').withArgs('delegates/').callsArgWith(2, {
        success: true,
        delegates,
      });

      controller.delegatesDisplayedCount = 100;
      controller.loading = false;
      const initialCount = controller.delegatesDisplayedCount;
      controller.showMore();
      expect(controller.delegatesDisplayedCount).to.equal(initialCount);
    });
  });

  describe('selectionChange(delegate)', () => {
    it('pushes delegate to this.unvoteList if delegate.status.voted && !delegate.status.selected', () => {
      const delegate = {
        status: {
          voted: true,
          selected: false,
        },
      };
      controller.selectionChange(delegate);
      expect(controller.unvoteList).to.contain(delegate);
    });

    it('pushes delegate to this.voteList if !delegate.status.voted && delegate.status.selected', () => {
      const delegate = {
        status: {
          voted: false,
          selected: true,
        },
      };
      controller.selectionChange(delegate);
      expect(controller.voteList).to.contain(delegate);
    });

    it('removes delegate from this.unvoteList if delegate.status.voted && delegate.status.selected', () => {
      const delegate = {
        status: {
          voted: true,
          selected: true,
        },
      };
      controller.unvoteList = [delegate];
      controller.selectionChange(delegate);
      expect(controller.unvoteList).to.not.contain(delegate);
    });

    it('removes delegate from this.voteList if !delegate.status.voted && !delegate.status.selected', () => {
      const delegate = {
        status: {
          voted: false,
          selected: false,
        },
      };
      controller.voteList = [delegate];
      controller.selectionChange(delegate);
      expect(controller.voteList).to.not.contain(delegate);
    });
  });

  describe('clearSearch()', () => {
    it('sets this.$scope.search to empty string', () => {
      controller.$scope.search = 'non-empty string';
      controller.clearSearch();
      expect(controller.$scope.search).to.equal('');
    });
  });

  describe('openVoteDialog()', () => {
    it('opens vote dialog', () => {
      const spy = sinon.spy(controller.$mdDialog, 'show');
      controller.openVoteDialog();
      expect(spy).to.have.been.calledWith();
    });
  });
});
