import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Login from './index';

describe('in <Login />', () => {
  it('Should render the login form"', () => {
    const wrapper = shallow(<Login />);
    expect(wrapper.find('form')).to.not.equal(undefined);
  });
});
