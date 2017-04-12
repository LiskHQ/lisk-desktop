const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const expect = chai.expect;
chai.use(sinonChai);

describe('Vote component', () => {
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

    $scope = $rootScope.$new();
    $scope.passphrase = 'robust swift grocery peasant forget share enable convince deputy road keep cheap';
    $scope.account = {
      address: '8273455169423958419L',
      balance: lsk.from(100),
    };
    $scope.voteList = Array.from({ length: 10 }, (v, k) => ({
      username: `genesis_${k}`,
    }));
    $scope.unvoteList = Array.from({ length: 3 }, (v, k) => ({
      username: `genesis_${k}`,
    }));
    element = $compile('<vote passphrase="passphrase" account="account" ' +
      'vote-list="voteList" unvote-list="unvoteList"></vote>')($scope);
    $scope.$digest();
  });

  const DIALOG_TITLE = 'Vote for delegates';
  it(`should contain a title saying "${DIALOG_TITLE}"`, () => {
    expect(element.find('h2').text()).to.equal(DIALOG_TITLE);
  });
});

describe('Vote component controller', () => {
  beforeEach(angular.mock.module('app'));

  let $rootScope;
  let $scope;
  let controller;
  let $componentController;
  let activePeerMock;
  let $peers;

  beforeEach(inject((_$componentController_, _$rootScope_, _$peers_) => {
    $componentController = _$componentController_;
    $rootScope = _$rootScope_;
    $peers = _$peers_;
  }));

  beforeEach(() => {
    $peers.active = { sendRequest() {} };
    activePeerMock = sinon.mock($peers.active);

    $scope = $rootScope.$new();
    controller = $componentController('vote', $scope, {
      account: {
        address: '8273455169423958419L',
        balance: '10000',
      },
    });
    controller.voteList = Array.from({ length: 10 }, (v, k) => ({
      username: `genesis_${k}`,
      status: {
        selected: true,
        voted: false,
        changed: true,
      },
    }));
    controller.unvoteList = Array.from({ length: 3 }, (v, k) => ({
      username: `genesis_${k}`,
      status: {
        selected: true,
        voted: true,
        changed: true,
      },
    }));
  });

  describe('vote()', () => {
    it('shows an error $mdToast if request fails', () => {
      const mdToastMock = sinon.mock(controller.$mdToast);
      mdToastMock.expects('show');
      activePeerMock.expects('sendRequest').withArgs('accounts/delegates').callsArgWith(2, {
        success: false,
      });

      controller.vote();
    });

    it('shows a success $mdToast if request succeeds', () => {
      const mdToastMock = sinon.mock(controller.$mdToast);
      mdToastMock.expects('show');
      activePeerMock.expects('sendRequest').withArgs('accounts/delegates').callsArgWith(2, {
        success: true,
      });

      controller.vote();
    });

    it('clears voteList and unvoteList $mdToast if request succeeds', () => {
      activePeerMock.expects('sendRequest').withArgs('accounts/delegates').callsArgWith(2, {
        success: true,
      });

      controller.vote();
      $scope.$apply();
      expect(controller.voteList).to.deep.equal([]);
      expect(controller.unvoteList).to.deep.equal([]);
    });
  });

  describe('removeVote(list, index)', () => {
    it('removes vote at index from the list', () => {
      const index = 2;
      const vote = controller.voteList[index];

      controller.removeVote(controller.voteList, index);

      expect(vote.status.changed).to.equal(false);
      expect(vote.status.selected).to.equal(false);
      expect(controller.voteList).to.not.contain(vote);
    });
  });
});

