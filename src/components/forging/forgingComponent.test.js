import React from 'react';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import ForgingComponent from './forgingComponent';
import * as forgingApi from '../../utils/api/forging';

chai.use(sinonChai);


describe('ForgingComponent', () => {
  let wrapper;
  let props;
  let forginApiMock;

  beforeEach(() => {
    props = {
      account: {
        delegate: {},
        isDelegate: true,
      },
      peers: {},
      statistics: {},
      forgedBlocks: [],
      onForgingStatsUpdate: sinon.spy(),
      onForgedBlocksLoaded: sinon.spy(),
    };

    forginApiMock = sinon.mock(forgingApi);
    forginApiMock.expects('getForgedStats').atLeast(5).resolves({ success: true });
    forginApiMock.expects('getForgedBlocks').resolves({ success: true, blocks: [] });

    wrapper = mount(<ForgingComponent {...props} />);
  });

  afterEach(() => {
    forginApiMock.restore();
  });

  it('should render ForgingTitle', () => {
    expect(wrapper.find('ForgingTitle')).to.have.lengthOf(1);
  });

  it('should render ForgingStats', () => {
    expect(wrapper.find('ForgingStats')).to.have.lengthOf(1);
  });

  it('should render DelegateStats', () => {
    expect(wrapper.find('DelegateStats')).to.have.lengthOf(1);
  });

  it('should render ForgedBlocks', () => {
    expect(wrapper.find('ForgedBlocks')).to.have.lengthOf(1);
  });

  it('should render only a "not delegate" message if !props.account.isDelegate', () => {
    props.account.isDelegate = false;
    wrapper = mount(<ForgingComponent {...props} />);

    expect(wrapper.find('ForgedBlocks')).to.have.lengthOf(0);
    expect(wrapper.find('DelegateStats')).to.have.lengthOf(0);
    expect(wrapper.find('p')).to.have.lengthOf(1);
  });

  // TODO: make these tests work
  it.skip('should call props.onForgingStatsUpdate', () => {
    expect(props.onForgingStatsUpdate).to.have.been.calledWith();
  });

  it.skip('should call props.onForgedBlocksLoaded', () => {
    expect(props.onForgedBlocksLoaded).to.have.been.calledWith();
  });
});
