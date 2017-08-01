import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import VotingComponent from './votingComponent';

describe('VotingComponent', () => {
  const address = '16313739661670634666L';
  const activePeer = {};
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<VotingComponent activePeer={activePeer} address={address}></VotingComponent>);
  });

  it('should render VotingHeader', () => {
    expect(wrapper.find('VotingHeader')).to.have.lengthOf(1);
  });

  it('should render Table', () => {
    expect(wrapper.find('Table')).to.have.lengthOf(1);
  });
});
