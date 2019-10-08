import React from 'react';
import { mount } from 'enzyme';
import withResizeValues from './withResizeValues';

describe('withResizeValues', () => {

  const className = 'dummy';
  const DummyComponent = () => <span className={className} />;

  const resizeWindow = (x, y) => {
    window.innerWidth = x;
    window.innerHeight = y;
    window.dispatchEvent(new Event('resize'));
  };

  it('should render passed component', () => {
    const DummyComponentHOC = withResizeValues(DummyComponent);
    const wrapper = mount(<DummyComponentHOC />);
    expect(wrapper).toContainMatchingElement(`.${className}`);
  });

  it('should render component properly after resize window to M breackpoint ( <= 1024)', () => {
    const DummyComponentHOC = withResizeValues(DummyComponent);
    const wrapper = mount(<DummyComponentHOC />);
    expect(wrapper).toContainMatchingElement(`.${className}`);
    expect(wrapper.state().isMediumViewPort).toBe(false);
    resizeWindow(1000, 500);
    wrapper.update();
    expect(wrapper.state().isMediumViewPort).toBe(true);
    wrapper.unmount();
  });
});
