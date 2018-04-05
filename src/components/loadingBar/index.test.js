import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import LoadingBarHOC from './';
import store from '../../store';


describe('LoadingBarHOC', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<Provider store={store}><LoadingBarHOC markAsLoaded={() => {}} /></Provider>);
  });

  it('should render Send', () => {
    expect(wrapper.find('LoadingBar')).to.have.lengthOf(1);
  });
});
