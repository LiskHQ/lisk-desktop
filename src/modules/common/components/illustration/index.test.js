import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import ThemeContext from 'src/theme/themeProvider';
import Illustration from './index';

describe('Illustration', () => {
  it('should render an image with given name', () => {
    const wrapper = mount(<Illustration name="helpCenter" />);
    expect(wrapper.find('img').props().src).to.deep.equal({});
  });

  it('should render dark illustration if available', () => {
    const wrapper = mount(
      <ThemeContext.Provider value="dark">
        <Illustration name="emptyBookmarksList" />
      </ThemeContext.Provider>
    );
    expect(wrapper.find('img').props().src).to.deep.equal({});
  });
});
