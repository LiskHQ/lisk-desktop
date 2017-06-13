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
  let delegateApiMock;
  let delegateApi;
  let $q;
  let accountDelegtatesDeferred;

  beforeEach(inject((_$componentController_, _$rootScope_, _delegateApi_, _$q_) => {
    $componentController = _$componentController_;
    $rootScope = _$rootScope_;
    delegateApi = _delegateApi_;
    $q = _$q_;
  }));

  beforeEach(() => {
    accountDelegtatesDeferred = $q.defer();
    delegateApiMock = sinon.mock(delegateApi);
    delegateApiMock.expects('listAccountDelegates').returns(accountDelegtatesDeferred.promise);

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

  describe('constructor()', () => {
    it('calls delegateApi.listAccountDelegates and then sets result to this.votedList', () => {
      const delegates = [{ username: 'genesis_42' }];
      accountDelegtatesDeferred.resolve({ success: true, delegates });
      $scope.$apply();
      expect(controller.votedList).to.deep.equal(delegates);
    });

    it('calls delegateApi.listAccountDelegates and if result.delegates is not defined then sets [] to this.votedList', () => {
      const delegates = undefined;
      accountDelegtatesDeferred.resolve({ success: true, delegates });
      $scope.$apply();
      expect(controller.votedList).to.deep.equal([]);
    });

    it('calls delegateApi.listAccountDelegates and then sets result to this.votedDict', () => {
      const delegates = [{ username: 'genesis_42' }];
      accountDelegtatesDeferred.resolve({ success: true, delegates });
      $scope.$apply();
      expect(controller.votedDict[delegates[0].username]).to.deep.equal(delegates[0]);
    });
  });

  describe('vote()', () => {
    let deffered;
    let dilaogServiceMock;

    beforeEach(() => {
      deffered = $q.defer();
      delegateApiMock.expects('vote').returns(deffered.promise);
      dilaogServiceMock = sinon.mock(controller.dialog);
    });

    afterEach(() => {
      dilaogServiceMock.verify();
      delegateApiMock.verify();
    });

    it('shows an error toast if request fails', () => {
      dilaogServiceMock.expects('errorToast');
      controller.vote();
      deffered.reject({ success: false });
      $scope.$apply();
    });

    it('shows a success alert if request succeeds', () => {
      dilaogServiceMock.expects('successAlert');
      controller.vote();
      deffered.resolve({ success: true });
      $scope.$apply();
    });
  });
});

