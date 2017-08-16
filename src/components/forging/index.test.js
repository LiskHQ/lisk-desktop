import React from 'react';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import * as forgingActions from '../../actions/forging';
import Forging from './';

chai.use(sinonChai);


describe('Forging', () => {
  let wrapper;

  beforeEach(() => {
    const store = configureMockStore([])({
      account: {},
      peers: {},
      forging: {
        statistics: {},
        forgedBlocks: [],
      },
    });
    wrapper = mount(<Provider store={store}><Forging /></Provider>);
  });

  it('should render ForgingComponent', () => {
    expect(wrapper.find('ForgingComponent')).to.have.lengthOf(1);
  });

  it('should bind updateForgedBlocks action to ForgingComponent props.onForgedBlocksLoaded', () => {
    const actionsSpy = sinon.spy(forgingActions, 'updateForgedBlocks');
    wrapper.find('ForgingComponent').props().onForgedBlocksLoaded([]);
    expect(actionsSpy).to.be.calledWith();
  });

  it('should bind updateForgingStats action to ForgingComponent props.onForgingStatsUpdate', () => {
    const actionsSpy = sinon.spy(forgingActions, 'updateForgingStats');
    wrapper.find('ForgingComponent').props().onForgingStatsUpdate({});
    expect(actionsSpy).to.be.calledWith();
  });
});
