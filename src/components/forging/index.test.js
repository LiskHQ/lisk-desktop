import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import PropTypes from 'prop-types';
import i18n from '../../i18n';
import ForgingHOC from './index';

describe('Forging HOC', () => {
  let wrapper;
  let store;

  beforeEach(() => {
    store = configureMockStore([])({
      account: { address: '10171906415056299071L' },
      peers: { data: {} },
      forging: {
        statistics: {},
        forgedBlocks: [],
      },
    });
    const options = {
      context: { store, i18n },
      childContextTypes: {
        store: PropTypes.object.isRequired,
        i18n: PropTypes.object.isRequired,
      },
    };
    wrapper = mount(<ForgingHOC />, options);
  });

  it('should render Forging component', () => {
    expect(wrapper.find('Forging')).to.have.lengthOf(1);
  });

  it('should render Forging component with expected properties', () => {
    const props = wrapper.find('Forging').props();
    const state = store.getState();

    expect(props.account).to.be.equal(state.account);
    expect(props.peers).to.be.equal(state.peers);
    expect(props.statistics).to.be.equal(state.forging.statistics);
    expect(props.forgedBlocks).to.be.equal(state.forging.forgedBlocks);

    expect(typeof props.onForgedBlocksLoaded).to.be.equal('function');
    expect(typeof props.onForgingStatsUpdated).to.be.equal('function');
  });
});
