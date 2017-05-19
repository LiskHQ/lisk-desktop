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
  let Peers;
  let lsk;

  beforeEach(angular.mock.module('app'));

  beforeEach(inject((_$compile_, _$rootScope_, _Peers_, _lsk_) => {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    Peers = _Peers_;
    lsk = _lsk_;
  }));

  beforeEach(() => {
    Peers.active = { sendRequest() {} };
    const mock = sinon.mock(Peers.active);
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
  let Peers;
  let delegates;
  let $q;
  let $timeout;

  beforeEach(inject((_$componentController_, _$rootScope_, _$q_, _Peers_, _$timeout_) => {
    $componentController = _$componentController_;
    $rootScope = _$rootScope_;
    Peers = _Peers_;
    $q = _$q_;
    $timeout = _$timeout_;
  }));

  beforeEach(() => {
    delegates = Array.from({ length: 100 }, (v, k) => ({
      username: `genesis_${k}`,
      status: {},
    }));

    Peers.active = { sendRequest() {} };
    activePeerMock = sinon.mock(Peers.active);

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

  describe('addToUnvoteList()', () => {
    it('adds delegate to unvoteList', () => {
      const delegate = {
        username: 'test',
        status: {
          voted: true,
          selected: true,
        },
      };
      controller.addToUnvoteList(delegate);
      expect(controller.unvoteList.length).to.equal(1);
      expect(controller.unvoteList[0]).to.deep.equal(delegate);
    });

    it('does not add delegate to unvoteList if already there', () => {
      const delegate = {
        username: 'genesis_42',
        status: {
          voted: true,
          selected: false,
        },
      };
      controller.unvoteList = [delegate];
      controller.addToUnvoteList(delegate);
      expect(controller.unvoteList.length).to.equal(1);
    });
  });

  describe('setPendingVotes()', () => {
    it('clears this.voteList and this.unvoteList', () => {
      controller.unvoteList = controller.delegates.slice(10, 13);
      expect(controller.voteList.length).to.not.equal(0);
      expect(controller.unvoteList.length).to.not.equal(0);

      controller.setPendingVotes();

      expect(controller.voteList.length).to.equal(0);
      expect(controller.unvoteList.length).to.equal(0);
    });
  });

  describe('checkPendingVotes()', () => {
    let delegateServiceMock;
    let accountDelegtatesDeferred;
    let delegate41;
    let delegate42;

    beforeEach(() => {
      accountDelegtatesDeferred = $q.defer();
      delegateServiceMock = sinon.mock(controller.delegateService);
      delegateServiceMock.expects('listAccountDelegates').returns(accountDelegtatesDeferred.promise);
      delegate41 = { username: 'genesis_41', status: {} };
      delegate42 = { username: 'genesis_42', status: {} };
    });

    afterEach(() => {
      delegateServiceMock.verify();
      delegateServiceMock.restore();
    });

    it('calls delegateService.listAccountDelegates and then removes all returned delegates from this.votePendingList', () => {
      controller.votePendingList = [delegate41, delegate42];
      controller.unvotePendingList = [];

      controller.checkPendingVotes();

      $timeout.flush();
      accountDelegtatesDeferred.resolve({ success: true, delegates: [delegate42] });
      $scope.$apply();

      expect(controller.votePendingList.length).to.equal(1);
      expect(controller.votePendingList[0]).to.deep.equal(delegate41);
    });

    it('calls delegateService.listAccountDelegates and then removes all NOT returned delegates from this.unvotePendingList', () => {
      controller.votePendingList = [];
      controller.unvotePendingList = [delegate41, delegate42];

      controller.checkPendingVotes();

      $timeout.flush();
      accountDelegtatesDeferred.resolve({ success: true, delegates: [delegate42] });
      $scope.$apply();

      expect(controller.unvotePendingList.length).to.equal(1);
      expect(controller.unvotePendingList[0]).to.deep.equal(delegate42);
    });

    it('calls delegateService.listAccountDelegates and if in the end there are still some votes pending calls itself again', () => {
      controller.votePendingList = [];
      controller.unvotePendingList = [delegate41, delegate42];

      controller.checkPendingVotes();

      $timeout.flush();
      const selfMock = sinon.mock(controller);
      selfMock.expects('checkPendingVotes');
      accountDelegtatesDeferred.resolve({ success: true, delegates: [] });

      $scope.$apply();
    });
  });

  describe('parseVoteListFromInput(list)', () => {
    let delegateServiceMock;

    beforeEach(() => {
      delegateServiceMock = sinon.mock(controller.delegateService);
    });

    it('parses this.usernameInput to list of delegates and opens vote dialog if all delegates were immediately resolved', () => {
      const spy = sinon.spy(controller, 'openVoteDialog');
      controller.usernameInput = 'genesis_20\ngenesis_42\ngenesis_46\n';
      controller.parseVoteListFromInput(controller.unvoteList);
      expect(spy).to.have.been.calledWith();
    });

    it('parses this.usernameInput to list of delegates and opens vote dialog if all delegates were resolved immediately or from server', () => {
      const username = 'not_fetched_yet';
      const deffered = $q.defer();
      delegateServiceMock.expects('getDelegate').withArgs(username).returns(deffered.promise);
      const spy = sinon.spy(controller, 'openVoteDialog');
      controller.usernameInput = `${username}\ngenesis_42\ngenesis_46`;

      controller.parseVoteListFromInput(controller.unvoteList);

      deffered.resolve({
        success: true,
        delegate: {
          username,
        },
      });
      $scope.$apply();
      expect(spy).to.have.been.calledWith();
    });

    it('parses this.usernameInput to list of delegates and opens vote dialog if any delegates were resolved', () => {
      const username = 'invalid_name';
      const deffered = $q.defer();
      delegateServiceMock.expects('getDelegate').withArgs(username).returns(deffered.promise);
      const spy = sinon.spy(controller, 'openVoteDialog');
      controller.usernameInput = `${username}\ngenesis_42\ngenesis_46`;

      controller.parseVoteListFromInput(controller.unvoteList);

      deffered.reject({ success: false });
      $scope.$apply();
      expect(spy).to.have.been.calledWith();
    });

    it('parses this.usernameInput to list of delegates and shows error toast if no delegates were resolved', () => {
      const username = 'invalid_name';
      const deffered = $q.defer();
      delegateServiceMock.expects('getDelegate').withArgs(username).returns(deffered.promise);
      const toastSpy = sinon.spy(controller.dialog, 'errorToast');
      const dialogSpy = sinon.spy(controller, 'openVoteDialog');
      controller.usernameInput = username;
      controller.voteList = [];

      controller.parseVoteListFromInput(controller.unvoteList);

      deffered.reject({ success: false });
      $scope.$apply();
      expect(toastSpy).to.have.been.calledWith();
      expect(dialogSpy).to.not.have.been.calledWith();
    });
  });

  describe('parseUnvoteListFromInput(list)', () => {
    it('parses this.usernameInput to list of delegates and opens vote dialog if all delegates were immediately resolved', () => {
      const delegate = {
        username: 'genesis_20',
        status: {},
      };
      const spy = sinon.spy(controller, 'openVoteDialog');
      controller.votedDict[delegate.username] = delegate;
      controller.usernameInput = `${delegate.username}\ngenesis_42\ngenesis_46\n`;
      controller.parseUnvoteListFromInput(controller.unvoteList);
      expect(spy).to.have.been.calledWith();
    });
  });
});
