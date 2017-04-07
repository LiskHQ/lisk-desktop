const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const expect = chai.expect;
chai.use(sinonChai);

describe('Forging component', () => {
  let $compile;
  let $rootScope;
  let element;
  let $scope;
  let lsk;
  let $peers;
  let delegate;

  beforeEach(angular.mock.module('app'));

  beforeEach(inject((_$compile_, _$rootScope_, _lsk_, _$peers_) => {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    lsk = _lsk_;
    $peers = _$peers_;
  }));

  beforeEach(() => {
    delegate = {
      address: '14018336151296112016L',
      approval: 90,
      missedblocks: 10,
      producedblocks: 304,
      productivity: 96.82,
      publicKey: '3ff32442bb6da7d60c1b7752b24e6467813c9b698e0f278d48c43580da972135',
      rate: 20,
      username: 'genesis_42',
      vote: '9999982470000000',
    };

    $peers.active = { sendRequest() {} };
    const mock = sinon.mock($peers.active);
    mock.expects('sendRequest').withArgs('blocks').callsArgWith(2, {
      success: true,
      blocks: [],
    });
    mock.expects('sendRequest').withArgs('delegates/get').callsArgWith(2, {
      success: true,
      delegate,
    });
    mock.expects('sendRequest').withArgs('delegates/forging/getForgedByAccount').exactly(5);

    $scope = $rootScope.$new();
    $scope.account = {
      address: delegate.address,
      balance: lsk.from(100),
    };
    element = $compile('<forging account="account"></forging>')($scope);
    $scope.$digest();
  });

  it('should contain a card with delegate name', () => {
    expect(element.find('md-card').text()).to.contain(delegate.username);
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
    expect(element.find('md-card .md-title').text()).to.equal(FORGED_BLOCKS_TITLE);
  });
});

