import React from 'react';
import { shallow } from 'enzyme';
import TabsContainer from './tabsContainer';

describe.skip('TabsContainer Component', () => {
  let wrapper;
  const children = [0, 1, 2].map((tab, key) => (
    <div key={key} name={`tab-${tab}`}>{`tab-${tab}`}</div>
  ));

  beforeEach(() => {
    wrapper = shallow(<TabsContainer>{children}</TabsContainer>);
  });

  it('Should act as noop if only one children present', () => {
    wrapper = shallow(
      <TabsContainer>
        <div name="tab" />
      </TabsContainer>
    );
    expect(wrapper).toMatchSelector('div');
  });

  it('Should act as noop if children updates to only one', () => {
    wrapper = shallow(<TabsContainer>{children}</TabsContainer>);
    wrapper.setProps({
      children: <div name="tab" />,
    });
    wrapper.update();
    expect(wrapper).toMatchSelector('div');
  });

  it('Should update tabs if children updates', () => {
    wrapper = shallow(
      <TabsContainer>
        <div name="tab-0" />
        <div name="tab-1" />
      </TabsContainer>
    );
    wrapper.setProps({ children });
    wrapper.update();
    expect(wrapper).toContainMatchingElements(3, '.contentHolder > div');
    expect(wrapper.find('.tabs li').at(0)).toHaveClassName('active');
    expect(wrapper.find('.contentHolder > div').at(0)).toHaveClassName('active');

    wrapper = shallow(
      <TabsContainer>
        <div name="tab-0" />
        <div name="tab-1" />
      </TabsContainer>
    );
    wrapper.setProps({ children, activeTab: 'tab-1' });
    wrapper.update();
    expect(wrapper.find('.tabs li').at(1)).toHaveClassName('active');
    expect(wrapper.find('.contentHolder > div').at(1)).toHaveClassName('active');
  });

  it('Should render with selected Tab if activeTab prop is present', () => {
    wrapper = shallow(<TabsContainer activeTab="tab-2">{children}</TabsContainer>);
    expect(wrapper.find('.tabs li').at(2)).toHaveClassName('active');
    expect(wrapper.find('.contentHolder > div').at(2)).toHaveClassName('active');
  });

  it('Should render tabs for each child that has name props', () => {
    expect(wrapper).toContainMatchingElements(3, 'li');
    expect(wrapper).toContainMatchingElements(3, '.contentHolder > div');
  });

  it('Should change selected tab onClick', () => {
    wrapper
      .find('.tabs li')
      .at(1)
      .simulate('click', { target: { dataset: { name: 'tab-1' } } });
    expect(wrapper.find('.tabs li').at(1)).toHaveClassName('active');
    expect(wrapper.find('.contentHolder > div').at(1)).toHaveClassName('active');
  });
});
