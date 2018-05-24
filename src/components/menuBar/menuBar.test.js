import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import MenuBar from './menuBar';

describe('MenuBar', () => {
  let wrapper;
  const props = {
    t: key => key,
    menuStatus: false,
    settingStatus: false,
  };

  props.menuToggle = () => { props.menuStatus = !props.menuStatus; };

  /**
   * Clicks on the given element in Component
   * then updates the component
   *
   * @param {String} selector - Valid css selector
   */
  const clickAndUpdate = (selector) => {
    wrapper.find(selector).simulate('click');
    wrapper = mount(<MenuBar {...props} />);
  };

  const getClassList = selector => wrapper.find(selector).props().className;

  it('should call menuToggle when menuButton called', () => {
    wrapper = mount(<MenuBar {...props} />);
    const buttonSelector = '.menu-button';
    expect(getClassList(buttonSelector)).to.include('expand');
    // clicking on menu shows the close button
    clickAndUpdate(buttonSelector);
    expect(getClassList(buttonSelector)).to.include('close');

    // the second click reverts to initial state
    clickAndUpdate(buttonSelector);
    expect(getClassList(buttonSelector)).to.include('expand');
  });
});
