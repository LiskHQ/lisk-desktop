import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import ClickToSend from './clickToSend';

const Dummy = () => (<span />);

describe('ClickToSend', () => {
  let setActiveDialog;

  beforeEach(() => {
    setActiveDialog = sinon.spy();
  });

  it('allows open send modal with pre-filled address ', () => {
    const wrapper = mount(
      <ClickToSend address='16313739661670634666L'
        setActiveDialog={setActiveDialog}><Dummy /></ClickToSend>);
    wrapper.simulate('click');
    expect(setActiveDialog).to.have.been.calledWith();
    expect(wrapper.find('Dummy')).to.have.length(1);
  });

  it('allows open send modal with pre-filled rawAmount ', () => {
    const wrapper = mount(
      <ClickToSend rawAmount='100000000'
        setActiveDialog={setActiveDialog}><Dummy /></ClickToSend>);
    wrapper.simulate('click');
    expect(setActiveDialog).to.have.been.calledWith();
    expect(wrapper.find('Dummy')).to.have.length(1);
  });

  it('should do nothing if props.disabled', () => {
    const wrapper = mount(
      <ClickToSend disabled={true}
        setActiveDialog={setActiveDialog}><Dummy />
      </ClickToSend>);
    wrapper.simulate('click');
    expect(wrapper.find('Dummy')).to.have.length(1);
  });
});
