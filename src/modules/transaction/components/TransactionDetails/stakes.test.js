import React from 'react';
import { mountWithRouter } from 'src/utils/testHelpers';
import { mockAppsTokens } from '@token/fungible/__fixtures__';
import usePosToken from '@pos/validator/hooks/usePosToken';
import { useValidators } from '@pos/validator/hooks/queries/useValidators';
import { mockValidators, getMockValidators } from '@pos/validator/__fixtures__';
import { StakesPure } from './stakes';

jest.mock('@pos/validator/hooks/usePosToken');
jest.mock('@pos/validator/hooks/queries/useValidators');

describe('Transaction stakes', () => {
  let wrapper;
  const props = {
    t: (v) => v,
  };

  usePosToken.mockReturnValue({ token: mockAppsTokens.data[0] });
  useValidators.mockReturnValue({ data: mockValidators });

  const validatorAddress = mockValidators.data[0].address;
  const { name } = getMockValidators(validatorAddress).data[0];
  jest.spyOn(React, 'useContext').mockImplementation(() => ({
    transaction: {
      type: 3,
      params: {
        stakes: [
          { validatorAddress: 'lsk123', amount: '1000000000' },
          { validatorAddress, amount: '-2000000000' },
        ],
      },
    },
  }));

  it('Should render with added and deleted Stakes', () => {
    wrapper = mountWithRouter(StakesPure, props);
    expect(wrapper).toContainMatchingElements(2, '.stake-item-address');
    expect(wrapper.find('.primaryText').at(0).text()).toEqual('lsk123');
    expect(wrapper.find('.stake-item-value').at(0).text()).toEqual('10 LSK');
    expect(wrapper.find('.primaryText').at(1).text()).toEqual(name);
    expect(wrapper.find('.stake-item-value').at(1).text()).toEqual('-20 LSK');
  });

  it('Should fetch and render validator name when validator API responds', () => {
    wrapper = mountWithRouter(StakesPure, props);
    expect(wrapper.find('.primaryText').at(1).text()).toEqual(name);
  });

  it('Should fetch and render validator address when name is not present', () => {
    wrapper = mountWithRouter(StakesPure, props);
    expect(wrapper.find('.primaryText').at(0).text()).toEqual('lsk123');
  });
});
