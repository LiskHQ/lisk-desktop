import React from 'react';
import { mount } from 'enzyme';
import accounts from '@tests/constants/wallets';
import { StakesPure } from './stakes';

jest.spyOn(React, 'useContext').mockImplementation(() => ({
  transaction: {
    type: 3,
    params: {
      votes: [
        { delegateAddress: 'lsk123', amount: '1000000000' },
        { delegateAddress: 'lsk987', amount: '-2000000000' },
      ],
    },
  },
}));

describe('Transaction stakes', () => {
  let wrapper;
  const props = {
    t: v => v,
    votedDelegates: {
      data: {},
      loadData: jest.fn(),
    },
  };

  it('Should render with added and deleted Stakes', () => {
    wrapper = mount(<StakesPure {...props} />);
    expect(wrapper).toContainMatchingElements(2, '.stake-item-address');
    expect(wrapper.find('.primaryText').at(0).text()).toEqual('lsk123');
    expect(wrapper.find('.stake-item-value').at(0).text()).toEqual('10 LSK');
    expect(wrapper.find('.primaryText').at(1).text()).toEqual('lsk987');
    expect(wrapper.find('.stake-item-value').at(1).text()).toEqual('-20 LSK');
  });

  it('Should fetch and render delegate names', () => {
    const newProps = {
      ...props,
      votedDelegates: {
        ...props.votedDelegates,
        data: {
          lsk123: {
            ...accounts.delegate_candidate,
            account: { address: accounts.delegate_candidate.address },
          },
          lsk987: {
            ...accounts.validator,
            account: { address: accounts.validator.address },
          },
        },
      },
    };
    wrapper = mount(<StakesPure {...newProps} />);
    expect(newProps.votedDelegates.loadData).toHaveBeenCalled();
    expect(wrapper.find('.primaryText').at(0).text()).toEqual('test');
    expect(wrapper.find('.primaryText').at(1).text()).toEqual('genesis_17');
  });
});
