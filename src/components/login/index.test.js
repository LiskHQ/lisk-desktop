import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Login from './index';
import LoginForm from './login';

describe('Login', () => {
  it('should render the login form', () => {
    const wrapper = shallow(<Login />);
    expect(wrapper.find(LoginForm)).to.have.lengthOf(1);
  });
});
