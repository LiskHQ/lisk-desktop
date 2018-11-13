import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import PrivateWrapper from './privateWrapper';

const Private = () => <h1>Private</h1>;

describe('PrivateWrapper', () => {
  const isAuth = isAuthenticated => (
    shallow(<PrivateWrapper isAuthenticated={isAuthenticated}>
        <Private/ >
      </PrivateWrapper>)
  );
  it('should render children components if user is authenticated', () => {
    const wrapper = isAuth(true);
    expect(wrapper.find(Private)).to.have.length(1);
  });

  it('should do not render children components if user is not authenticated', () => {
    const wrapper = isAuth(false);
    expect(wrapper.find(Private)).to.have.length(0);
  });
});
