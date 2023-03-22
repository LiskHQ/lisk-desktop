import React from 'react';
import { EVENTS } from '@libs/wcm/constants/lifeCycle';
import { usePairings } from '@libs/wcm/hooks/usePairings';
import { mountWithRouter } from 'src/utils/testHelpers';
import ConnectionContext from '@libs/wcm/context/connectionContext';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import ConnectionProposal from './index';

jest.spyOn(React, 'useContext').mockImplementation(() => ({
  events: [{ name: EVENTS.SESSION_PROPOSAL, meta: { id: '1' } }],
}));
jest.mock('@libs/wcm/hooks/usePairings');
jest.mock('@walletconnect/utils', () => ({
  getSdkError: jest.fn(str => str),
}));
jest.mock('src/utils/searchParams', () => ({
  addSearchParamsToUrl: jest.fn(),
}));
jest.mock('@libs/wcm/utils/connectionCreator', () => ({
  createSignClient: jest.fn(() => Promise.resolve()),
  client: {
    pair: jest.fn(),
  },
}));

const context = {
  events: [{ name: EVENTS.SESSION_PROPOSAL, meta: {} }],
};

const setup = (value) => {
  const Component = () => (
    <ConnectionContext.Provider value={value}>
      <ConnectionProposal />
    </ConnectionContext.Provider>
  );

  return mountWithRouter(Component, {}, {});
};

describe('ConnectionProposal', () => {
  const setUri = jest.fn(() => ({
    status: 'SUCCESS',
    data: {},
  }));
  usePairings.mockReturnValue({
    setUri,
  });

  it('Should mount correctly', () => {
    const wrapper = setup(context);
    expect(wrapper.find('input')).toHaveLength(1);
    expect(wrapper.find('button')).toHaveLength(1);
  });

  it('Should call setUri if the form is submitted', () => {
    const wrapper = setup(context);
    wrapper.find('input').simulate('change', { target: { value: '0x123' } });
    wrapper.find('button').simulate('click');
    expect(setUri).toHaveBeenCalledWith('0x123');
  });

  it('Should call setUri if there is a SESSION_PROPOSAL event', () => {
    setup(context);
    expect(addSearchParamsToUrl).toHaveBeenCalled();
  });
});
