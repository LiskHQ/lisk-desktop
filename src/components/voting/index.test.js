import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import Voting from './';
import store from '../../store';

describe('Voting', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<Provider store={store}><Voting /></Provider>);
  });

  it('should render VotingComponent', () => {
    expect(wrapper.find('VotingComponent')).to.have.lengthOf(1);
  });
});
