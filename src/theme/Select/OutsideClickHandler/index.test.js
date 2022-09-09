import React from 'react';
import { mount } from 'enzyme';
import OutsideClickHandler from './index';

describe('Outside Click Handler Compnent', () => {
  const props = {
    onOutsideClick: jest.fn(),
  };
  let eventsMap;

  beforeEach(() => {
    eventsMap = {};
    document.addEventListener = jest.fn((event, cb) => {
      eventsMap[event] = cb;
    });
    document.removeEventListener = jest.fn();
  });

  it('Should not add Event Listener and add afterwards if props disabled is set to false', () => {
    const wrapper = mount(
      <OutsideClickHandler {...props} disabled>
        <div className="child" />
      </OutsideClickHandler>
    );
    expect(wrapper).toContainExactlyOneMatchingElement('.child');
    expect(document.addEventListener).not.toBeCalled();
    wrapper.setProps({ disabled: false });
    expect(document.addEventListener).toBeCalled();
    wrapper.unmount();
    expect(document.removeEventListener).toBeCalled();
  });

  it('Should add Event Listener and remove after prop disabled is changed to true', () => {
    const wrapper = mount(
      <OutsideClickHandler {...props} disabled={false}>
        <span />
      </OutsideClickHandler>
    );
    expect(document.addEventListener).toBeCalled();
    wrapper.setProps({ disabled: true });
    expect(document.removeEventListener).toBeCalled();
  });

  it('Should call click outside if target is outside wrapper', () => {
    const wrapper = mount(
      <OutsideClickHandler {...props} disabled={false}>
        <div />
      </OutsideClickHandler>
    );
    expect(document.addEventListener).toBeCalled();
    eventsMap.click({ target: document.createElement('span') });
    expect(props.onOutsideClick).toBeCalledTimes(1);
    wrapper.setProps({ disabled: true });
    eventsMap.click({ target: document.createElement('span') });
    expect(props.onOutsideClick).not.toBeCalledTimes(2);
  });
});
