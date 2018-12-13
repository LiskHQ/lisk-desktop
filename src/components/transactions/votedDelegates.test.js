import React from 'react';
import { spy } from 'sinon';
import { expect } from 'chai';
import { mountWithContext } from '../../../test/utils/mountHelpers';
import VotedDelegates from './votedDelegates';

describe('VotedDelegates', () => {
  const props = {
    votes: new Array(100).fill({
      username: null,
      address: '3484156157234038617L',
      publicKey: 'bd56ce59f413370cf45dbc4be094acbd4de9c6894443476e5406dfc458337889',
      balance: '0',
    }),
    voters: new Array(100).fill({
      username: null,
      address: '3484156157234038617L',
      publicKey: 'bd56ce59f413370cf45dbc4be094acbd4de9c6894443476e5406dfc458337889',
      balance: '0',
    }),
    votersSize: 100,
    searchMoreVoters: spy(),
  };

  it('should render 100 voters', () => {
    const wrapper = mountWithContext(<VotedDelegates {...props}/>, {});
    expect(wrapper.find('.voters Link').length).to.have.equal(35);
  });
});

