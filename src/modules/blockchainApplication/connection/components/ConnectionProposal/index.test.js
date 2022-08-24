import React from 'react';
import { EVENTS } from '@libs/wcm/constants/lifeCycle';
import usePairings from '@libs/wcm/hooks/usePairings';
import { mountWithRouter } from 'src/utils/testHelpers';
import ConnectionProposal from './index';

jest.mock('@libs/wcm/hooks/usePairings');

jest.mock('@walletconnect/utils', () => ({
  getSdkError: jest.fn(str => str),
}));

jest.spyOn(React, 'useContext').mockImplementation(() => ({
  events: [{ name: EVENTS.SESSION_PROPOSAL, meta: { id: '1' } }],
}));

jest.mock('@libs/wcm/utils/connectionCreator', () => ({
  createSignClient: jest.fn(() => Promise.resolve()),
  client: {
    pair: jest.fn(),
  },
}));

describe('ConnectionProposal', () => {
  const history = { push: jest.fn() };
  const setUri = jest.fn();
  usePairings.mockReturnValue({
    setUri,
  });

  it('Should mount correctly', () => {
    const wrapper = mountWithRouter(ConnectionProposal, {}, {});
    expect(wrapper.find('input')).toHaveLength(1);
    expect(wrapper.find('button')).toHaveLength(1);
  });

  it('Should call addSearchParamsToUrl if there is a SESSION_PROPOSAL event', () => {
    const wrapper = mountWithRouter(ConnectionProposal, { history }, {});
    wrapper.find('input').simulate('change', { target: { value: '0x123' } });
    wrapper.find('button').simulate('click');
    expect(setUri).toHaveBeenCalledWith('0x123');
  });
});
