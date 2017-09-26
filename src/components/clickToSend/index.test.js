import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import i18n from '../../i18n';
import ClickToSend from './index';
import RelativeLink from '../relativeLink';

const Dummy = () => (<span />);

describe('ClickToSend', () => {
  let setActiveDialog;
  const options = {
    context: { i18n },
    childContextTypes: {
      i18n,
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
