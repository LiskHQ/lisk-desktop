import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Tab, Tabs as ToolboxTabs } from 'react-toolbox';
import sinon from 'sinon';
import Tabs from './tabs';


describe('Tabs', () => {
  const history = {
    location: {
      pathname: '/main/voting',
    },
    push: sinon.spy(),
  };

  const t = key => key;

  it('should render react toolbox Tabs component', () => {
    const wrapper = mount(<Tabs history={history} t={t} />);
    expect(wrapper.find(ToolboxTabs).exists()).to.equal(true);
  });

  it('should render 3 Tab components if props.isDelegate', () => {
    const wrapper = mount(<Tabs isDelegate={true} history={history} t={t} />);
    expect(wrapper.find(Tab)).to.have.lengthOf(3);
  });

  it('should render 2 Tab components if !props.isDelegate', () => {
    const wrapper = mount(<Tabs isDelegate={false} history={history} t={t} />);
    expect(wrapper.find(Tab)).to.have.lengthOf(2);
  });

  it('should allow to change active tab', () => {
    const wrapper = mount(<Tabs isDelegate={false} history={history} t={t} />);
    wrapper.find(Tab).at(0).simulate('click');
    expect(history.push).to.have.been.calledWith('/main/transactions');
  });
});
