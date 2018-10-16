import React from 'react';
import { expect } from 'chai';
import { mountWithContext } from '../../../test/utils/mountHelpers';
import DelegateStatistics from './delegateStatistics';

describe('DelegateStatistics', () => {
  const props = {
    votes: new Array(40).fill({
      username: null,
      address: '3484156157234038617L',
      publicKey: 'bd56ce59f413370cf45dbc4be094acbd4de9c6894443476e5406dfc458337889',
      balance: '0',
    }),
    voters: new Array(40).fill({
      username: null,
      address: '3484156157234038617L',
      publicKey: 'bd56ce59f413370cf45dbc4be094acbd4de9c6894443476e5406dfc458337889',
      balance: '0',
    }),
    votersSize: 100,
  };

  it('should render DelegateStatistics', () => {
    const wrapper = mountWithContext(<DelegateStatistics />, {});
    expect(wrapper.find('DelegateStatistics').length).to.have.equal(1);
  });

  it('should not display showAll button, if all votes are already shown', () => {
    const wrapper = mountWithContext(<DelegateStatistics {...props}/>, {});

    expect(wrapper.find('.showMore').length).to.have.equal(1);
    wrapper.find('.showMore').at(0).simulate('click');
  });

  it('should render Waypoint component', () => {
    const wrapper = mountWithContext(<DelegateStatistics {...props} />, {});

    expect(wrapper).to.have.descendants('Waypoint');
    const waypoint = wrapper.find('Waypoint').at(0);
    waypoint.props().onEnter();
  });

  it('should render Waypoint when votersSize > votes', () => {
    const propsCpy = { ...props, votersSize: 40 };
    const wrapper = mountWithContext(<DelegateStatistics {...propsCpy} />, {});

    expect(wrapper).to.have.descendants('Waypoint');
    const waypoint = wrapper.find('Waypoint').at(0);
    waypoint.props().onEnter();
  });
});
