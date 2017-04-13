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
  let peersMock;
  let $peers;
  let $q;

  beforeEach(inject((_$componentController_, _$rootScope_, _$peers_, _$q_) => {
    $componentController = _$componentController_;
    $rootScope = _$rootScope_;
    $peers = _$peers_;
    $q = _$q_;
  }));

  beforeEach(() => {
    peersMock = sinon.mock($peers);

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
    let deffered;
    let mdToastMock;

    beforeEach(() => {
      deffered = $q.defer();
      peersMock.expects('sendRequestPromise').withArgs('accounts/delegates').returns(deffered.promise);
      mdToastMock = sinon.mock(controller.$mdToast);
      mdToastMock.expects('show');
    });

    afterEach(() => {
      mdToastMock.verify();
      peersMock.verify();
    });

    it('shows an error $mdToast if request fails', () => {
      controller.vote();
      deffered.reject({ success: false });
      $scope.$apply();
    });

    it('shows a success $mdToast if request succeeds', () => {
      controller.vote();
      deffered.resolve({ success: true });
      $scope.$apply();
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

