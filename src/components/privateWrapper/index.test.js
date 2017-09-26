import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { PrivateWrapperComponent } from '.';

const Private = () => <h1>Private</h1>;

describe('PrivateWrapperComponent', () => {
  const isAuth = isAuthenticated => (
    shallow(
      <PrivateWrapperComponent isAuthenticated={isAuthenticated}>
        <Private/ >
      </PrivateWrapperComponent>,
    )
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
