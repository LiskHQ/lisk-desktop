import React from 'react';
import { mount } from 'enzyme';
import AccountCreated from './accountCreated';

describe('Register Process - Account created', () => {
  let wrapper;
  const props = {
    t: (k) => k,
  };

  beforeEach(() => {
    wrapper = mount(<AccountCreated {...props} />);
  });

  it('Should render screen with illustration and continue button', () => {
    expect(wrapper.find('illustration')).toBeTruthy();
    expect(wrapper.find('continueBtn')).toBeTruthy();
  });
});
