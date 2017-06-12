const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const moment = require('moment');

const expect = chai.expect;
chai.use(sinonChai);

describe('Forging component', () => {
  let $compile;
  let $rootScope;
  let element;
  let $scope;
  let lsk;
  let delegate;
  let account;
  let forgingApiMock;
  let $q;
  let peers;

  beforeEach(angular.mock.module('app'));

  beforeEach(inject((_$compile_, _$rootScope_, _lsk_, _Account_, _$q_, _Peers_) => {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    lsk = _lsk_;
    account = _Account_;
    $q = _$q_;
    peers = _Peers_;
  }));

  beforeEach(() => {
    delegate = {
      passphrase: 'recipe bomb asset salon coil symbol tiger engine assist pact pumpkin visit',
      address: '537318935439898807L',
      approval: 90,
      missedblocks: 10,
      producedblocks: 304,
      productivity: 96.82,
      publicKey: '3ff32442bb6da7d60c1b7752b24e6467813c9b698e0f278d48c43580da972135',
      rate: 20,
      username: 'genesis_42',
      vote: '9999982470000000',
    };

    const network = {
      address: 'http://localhost:4000',
      custom: true,
      name: 'Custom Node',
      nethash: '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
      node: 'localhost',
      port: '4000',
      ssl: false,
      testnet: true,
    };
    const testAcount = {
      passphrase: delegate.passphrase,
      balance: lsk.from(100),
      network,
      delegate,
      isDelegate: true,
    };

    account.set(testAcount);
    peers.setActive(network);

    $scope = $rootScope.$new();
    element = $compile('<forging></forging>')($scope);

    const controller = element.controller('forging');
    forgingApiMock = sinon.mock(controller.forgingApi);

    let deferred = $q.defer();
    deferred = $q.defer();
    forgingApiMock.expects('getForgedBlocks').returns(deferred.promise);
    deferred.resolve({
      success: true,
      blocks: [],
    });

    deferred = $q.defer();
    forgingApiMock.expects('getForgedStats').returns(deferred.promise).exactly(5);
    deferred.resolve({ });

    controller.$scope.$emit('accountChange', testAcount);
    $scope.$digest();
  });

  afterEach(() => {
    forgingApiMock.verify();
    forgingApiMock.restore();
  });

  it('should contain a card with delegate name', () => {
    expect(element.find('.delegate-name').text()).to.contain(delegate.username);
  });

  it('should contain a card with rank ', () => {
    expect(element.find('md-card').text()).to.contain(`Rank${delegate.rate}`);
  });

  it('should contain a card with productivity ', () => {
    expect(element.find('md-card').text()).to.contain(`Productivity${delegate.productivity}%`);
  });

  it('should contain a card with approval ', () => {
    expect(element.find('md-card').text()).to.contain(`Approval${delegate.approval}%`);
  });

  const FORGED_BLOCKS_TITLE = 'Forged Blocks';
  it(`should contain a card with title ${FORGED_BLOCKS_TITLE}`, () => {
    expect(element.find('md-card.forged-blocks .md-title').text()).to.equal(FORGED_BLOCKS_TITLE);
  });
});

describe('forging component controller', () => {
  beforeEach(angular.mock.module('app'));

  let $rootScope;
  let $scope;
  let controller;
  let $componentController;
  let forgingApiMock;
  let forgingApi;
  let delegate;
  let blocks;
  let account;
  let $q;
  let peers;

  beforeEach(inject((_$componentController_, _$rootScope_,
    _forgingApi_, _Account_, _$q_, _Peers_) => {
    $componentController = _$componentController_;
    $rootScope = _$rootScope_;
    forgingApi = _forgingApi_;
    account = _Account_;
    $q = _$q_;
    peers = _Peers_;
  }));

  beforeEach(() => {
    blocks = Array.from({ length: 10 }, (v, k) => ({
      id: 10 - k,
      timestamp: 10 - k,
    }));

    delegate = {
      passphrase: 'recipe bomb asset salon coil symbol tiger engine assist pact pumpkin visit',
      address: '537318935439898807L',
      approval: 90,
      missedblocks: 10,
      producedblocks: 304,
      productivity: 96.82,
      publicKey: '86499879448d1b0215d59cbf078836e3d7d9d2782d56a2274a568761bff36f19',
      rate: 20,
      username: 'genesis_42',
      vote: '9999982470000000',
    };

    forgingApiMock = sinon.mock(forgingApi);

    $scope = $rootScope.$new();
    account.set({
      passphrase: delegate.passphrase,
      balance: '10000',
    });
    peers.setActive({ nane: 'mainnet' });
    controller = $componentController('forging', $scope, { });
  });

  afterEach(() => {
    forgingApiMock.verify();
    forgingApiMock.restore();
  });

  describe('updateForgedBlocks(limit, offset)', () => {
    let deferred;

    beforeEach(() => {
      deferred = $q.defer();
      forgingApiMock.expects('getForgedBlocks').returns(deferred.promise);
    });

    it('does nothing if request fails', () => {
      controller.updateForgedBlocks(10);
      deferred.reject();
      $scope.$apply();
      expect(controller.blocks).to.deep.equal([]);
    });

    it('updates this.blocks with what was returned', () => {
      controller.updateForgedBlocks(10);
      deferred.resolve({
        success: true,
        blocks,
      });
      $scope.$apply();
      expect(controller.blocks.length).to.equal(10);
      expect(controller.blocks).to.deep.equal(blocks);
    });

    it('appends returned blocks to this.blocks if offset is set', () => {
      const extraBlocks = Array.from({ length: 20 }, (v, k) => ({
        id: 0 - k,
        timestamp: 0 - k,
      }));

      controller.blocks = blocks;
      controller.updateForgedBlocks(20, 10);
      deferred.resolve({
        success: true,
        blocks: extraBlocks,
      });
      $scope.$apply();
      expect(controller.blocks.length).to.equal(30);
      expect(controller.blocks).to.deep.equal(blocks);
    });

    it('does not change this.blocks when returned blocks values are unchanged', () => {
      controller.blocks = blocks;
      controller.updateForgedBlocks(10);
      deferred.resolve({
        success: true,
        blocks,
      });
      $scope.$apply();
      expect(controller.blocks).to.deep.equal(blocks);
    });

    it('prepends to this.blocks when returned blocks contains a new value', () => {
      const newBlock = { id: 11, timestamp: 11 };
      controller.blocks = blocks;
      controller.updateForgedBlocks(10);
      deferred.resolve({
        success: true,
        blocks: [newBlock].concat(blocks),
      });
      $scope.$apply();
      expect(controller.blocks.length).to.equal(11);
      expect(controller.blocks[0]).to.deep.equal(newBlock);
    });
  });

  describe('loadMoreBlocks()', () => {
    it('fetches and appends 20 more blocks to this.blocks', () => {
      const extraBlocks = Array.from({ length: 20 }, (v, k) => ({
        id: 0 - k,
        timestamp: 0 - k,
      }));
      const deferred = $q.defer();
      forgingApiMock.expects('getForgedBlocks').returns(deferred.promise);
      controller.blocks = blocks;
      controller.blocksLoaded = true;
      controller.moreBlocksExist = true;

      controller.loadMoreBlocks();
      deferred.resolve({
        success: true,
        blocks: extraBlocks,
      });
      $scope.$apply();
      expect(controller.blocks.length).to.equal(30);
      expect(controller.blocks).to.deep.equal(blocks);
    });
  });

  describe('updateForgingStats(key, startMoment)', () => {
    let deferred;

    beforeEach(() => {
      deferred = $q.defer();
      forgingApiMock.expects('getForgedStats').returns(deferred.promise);
    });

    it('fetches forged by account since startMoment and sets it to this.statistics[key]', () => {
      const forged = 42;
      const key = 'testStat';
      const startMoment = moment().subtract(1, 'days');

      expect(controller.statistics[key]).to.equal(undefined);
      controller.updateForgingStats(key, startMoment);
      deferred.resolve({
        success: true,
        forged,
      });
      $scope.$apply();
      expect(controller.statistics[key]).to.equal(forged);
    });

    it('does nothing after failing to fetch forged by account since startMoment', () => {
      const key = 'testStat';
      const startMoment = moment().subtract(1, 'days');

      expect(controller.statistics[key]).to.equal(undefined);
      controller.updateForgingStats(key, startMoment);
      deferred.reject();
      $scope.$apply();
      expect(controller.statistics[key]).to.equal(undefined);
    });
  });
});
