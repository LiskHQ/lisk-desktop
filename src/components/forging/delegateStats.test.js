import React from 'react';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { mount } from 'enzyme';
import DelegateStats from './delegateStats';

chai.use(sinonChai);

describe('DelegateStats', () => {
  const delegate = {
    username: 'genesis_17',
    rate: 19,
    approval: 30,
    productivity: 99.2,
  };
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<DelegateStats delegate={delegate} />);
  });

  it('should render 3 Card components', () => {
    expect(wrapper.find('Card')).to.have.lengthOf(3);
  });

  it('should render 3 CircularProgressbar components', () => {
    expect(wrapper.find('svg.CircularProgressbar')).to.have.lengthOf(3);
  });
});
