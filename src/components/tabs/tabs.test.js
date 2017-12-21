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

  it('should render 8 Button components if props.isDelegate', () => {
    const wrapper = mount(<Tabs isDelegate={true} history={history} t={t} />);
    expect(wrapper.find(Tab)).to.have.lengthOf(7);
  });

  it('should render 7 Tab components if !props.isDelegate', () => {
    const wrapper = mount(<Tabs isDelegate={false} history={history} t={t} />);
    expect(wrapper.find(Tab)).to.have.lengthOf(6);
  });

  it('should allow to change active tab', () => {
    const wrapper = mount(<Tabs isDelegate={false} history={history} t={t} />);
    wrapper.find(Tab).at(0).simulate('click');
    expect(history.push).to.have.been.calledWith('/main/transactions');
  });

  it('should click on more activate the drawer', () => {
    const wrapper = mount(<Tabs isDelegate={false} history={history} t={t} />);
    wrapper.find('#moreMenu').simulate('click');
    wrapper.update();
    expect(wrapper.state('active')).to.be.equal(true);
  });
});
