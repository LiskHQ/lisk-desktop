import React from 'react';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { mount } from 'enzyme';
import ForgingComponent from './forgingComponent';

chai.use(sinonChai);


describe('<ForgingComponent />', () => {
  let wrapper;
  const props = {
    account: {
      delegate: {},
    },
    peers: {},
    statistics: {},
    forgedBlocks: [],
    loadStats: () => {},
    loadForgedBlocks: () => {},
  };

  beforeEach(() => {
    wrapper = mount(<ForgingComponent {...props} />);
  });

  it('should render <ForgingTitle/>', () => {
    expect(wrapper.find('ForgingTitle')).to.have.lengthOf(1);
  });

  it('should render <ForgingStats/>', () => {
    expect(wrapper.find('ForgingStats')).to.have.lengthOf(1);
  });

  it('should render <DelegateStats/>', () => {
    expect(wrapper.find('DelegateStats')).to.have.lengthOf(1);
  });

  it('should render <ForgedBlocks/>', () => {
    expect(wrapper.find('ForgedBlocks')).to.have.lengthOf(1);
  });
});
