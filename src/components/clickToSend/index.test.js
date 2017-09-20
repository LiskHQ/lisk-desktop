import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import sinon from 'sinon';
import ClickToSend from './index';
import RelativeLink from '../relativeLink';

const Dummy = () => (<span />);

describe('ClickToSend', () => {
  let setActiveDialog;
  const store = configureMockStore([])({
    peers: { data: {} },
    account: {},
    activePeerSet: () => {},
  });
  const options = {
    context: { store },
    childContextTypes: {
      store,
    },
  };

  beforeEach(() => {
    setActiveDialog = sinon.spy();
  });

  it('should render a RelativeLink component', () => {
    const wrapper = shallow(
      <ClickToSend address='16313739661670634666L'
        setActiveDialog={setActiveDialog}><Dummy /></ClickToSend>, options);
    expect(wrapper.find(RelativeLink)).to.have.length(1);
  });

  it('should render its child component', () => {
    const wrapper = shallow(
      <ClickToSend rawAmount='100000000'><Dummy /></ClickToSend>, options);
    expect(wrapper.find('Dummy')).to.have.length(1);
  });
});
