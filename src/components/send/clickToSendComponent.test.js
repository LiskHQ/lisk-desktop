import React from 'react';
import chai, { expect } from 'chai';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import ClickToSendComponent from './clickToSendComponent';

const Dummy = () => (<span />);

chai.use(sinonChai);
chai.use(chaiEnzyme()); // Note the invocation at the end
describe('ClickToSendComponent', () => {
  let setActiveDialog;

  beforeEach(() => {
    setActiveDialog = sinon.spy();
  });

  it('allows open send modal with pre-filled address ', () => {
    const wrapper = mount(
      <ClickToSendComponent address='16313739661670634666L'
        setActiveDialog={setActiveDialog}><Dummy /></ClickToSendComponent>);
    wrapper.simulate('click');
    expect(setActiveDialog).to.have.been.calledWith();
    expect(wrapper.find('Dummy')).to.have.length(1);
  });

  it('allows open send modal with pre-filled rawAmount ', () => {
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
