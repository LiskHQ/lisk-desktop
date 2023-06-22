import React from 'react';
import { mountWithRouter } from 'src/utils/testHelpers';
import accounts from '@tests/constants/wallets';
import { mockAppsTokens } from '@token/fungible/__fixtures__';
import usePosToken from '@pos/validator/hooks/usePosToken';
import { StakesPure } from './stakes';

jest.mock('@pos/validator/hooks/usePosToken');

jest.spyOn(React, 'useContext').mockImplementation(() => ({
  transaction: {
    type: 3,
    params: {
      stakes: [
        { validatorAddress: 'lsk123', amount: '1000000000' },
        { validatorAddress: 'lsk987', amount: '-2000000000' },
      ],
    },
  },
}));

describe('Transaction stakes', () => {
  let wrapper;
  const props = {
    t: (v) => v,
    stakedValidator: {
      data: {},
      loadData: jest.fn(),
    },
  };

  usePosToken.mockReturnValue({ token: mockAppsTokens.data[0] });

  it('Should render with added and deleted Stakes', () => {
    wrapper = mountWithRouter(StakesPure, props);
    expect(wrapper).toContainMatchingElements(2, '.stake-item-address');
    expect(wrapper.find('.primaryText').at(0).text()).toEqual('lsk123');
    expect(wrapper.find('.stake-item-value').at(0).text()).toEqual('10 LSK');
    expect(wrapper.find('.primaryText').at(1).text()).toEqual('lsk987');
    expect(wrapper.find('.stake-item-value').at(1).text()).toEqual('-20 LSK');
  });

  it('Should fetch and render validator names', () => {
    const newProps = {
      ...props,
      stakedValidator: {
        ...props.stakedValidator,
        data: {
          lsk123: {
            ...accounts.validator_candidate,
            account: { validatorAddress: accounts.validator_candidate.address },
          },
          lsk987: {
            ...accounts.validator,
            account: { validatorAddress: accounts.validator.address },
          },
        },
      },
    };
    wrapper = mountWithRouter(StakesPure, newProps);
    expect(newProps.stakedValidator.loadData).toHaveBeenCalled();
    expect(wrapper.find('.primaryText').at(0).text()).toEqual('lsk123');
    expect(wrapper.find('.primaryText').at(1).text()).toEqual('lsk987');
  });
});
