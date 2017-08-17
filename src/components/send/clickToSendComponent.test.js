import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import ClickToSendComponent from './clickToSendComponent';

const Dummy = () => (<span />);

describe('ClickToSendComponent', () => {
  let setActiveDialog;

  beforeEach(() => {
    setActiveDialog = sinon.spy();
  });

  it('allows open send modal with prefilled address ', () => {
    const wrapper = mount(
      <ClickToSendComponent address='16313739661670634666L'
        setActiveDialog={setActiveDialog}><Dummy /></ClickToSendComponent>);
    wrapper.simulate('click');
    expect(setActiveDialog).to.have.been.calledWith();
    expect(wrapper.find('Dummy')).to.have.length(1);
  });

  it('allows open send modal with prefilled rawAmount ', () => {
    const wrapper = mount(
      <ClickToSendComponent rawAmount='100000000'
        setActiveDialog={setActiveDialog}><Dummy /></ClickToSendComponent>);
    wrapper.simulate('click');
    expect(setActiveDialog).to.have.been.calledWith();
    expect(wrapper.find('Dummy')).to.have.length(1);
  });

  it('should do nothing if props.disabled', () => {
    const wrapper = mount(
      <ClickToSendComponent disabled={true}
        setActiveDialog={setActiveDialog}><Dummy />
      </ClickToSendComponent>);
    wrapper.simulate('click');
    expect(wrapper.find('Dummy')).to.have.length(1);
  });
});
