import React from 'react';
import { EVENTS } from '@libs/wcm/constants/lifeCycle';
import { usePairings } from '@libs/wcm/hooks/usePairings';
import { mountWithRouterAndQueryClient } from 'src/utils/testHelpers';
import ConnectionContext from '@libs/wcm/context/connectionContext';
import { isValidWCURI } from '@libs/wcm/utils/validator';
import mockApplicationsManage from '@tests/fixtures/blockchainApplicationsManage';
import { useBlockchainApplicationMeta } from '@blockchainApplication/manage/hooks/queries/useBlockchainApplicationMeta';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import ConnectionProposal from './index';

jest.mock('@blockchainApplication/manage/hooks/queries/useBlockchainApplicationMeta');
jest.spyOn(React, 'useContext').mockImplementation(() => ({
  events: [
    {
      name: EVENTS.SESSION_PROPOSAL,
      meta: {
        id: '1',
        params: {
          requiredNamespaces: { lisk: {} },
        },
      },
    },
  ],
}));
jest.mock('@libs/wcm/hooks/usePairings');
jest.mock('@walletconnect/utils', () => ({
  getSdkError: jest.fn((str) => str),
}));
jest.mock('src/utils/searchParams', () => ({
  addSearchParamsToUrl: jest.fn(),
}));
jest.mock('@libs/wcm/utils/connectionCreator', () => ({
  createSignClient: jest.fn(() => Promise.resolve()),
}));
jest.mock('@libs/wcm/utils/validator', () => ({
  isValidWCURI: jest.fn(),
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

  return mountWithRouterAndQueryClient(Component, {}, {});
};

describe('ConnectionProposal', () => {
  let setUri;
  beforeEach(() => {
    isValidWCURI.mockReturnValue(true);
    setUri = jest.fn().mockResolvedValue({
      status: 'SUCCESS',
      message: '',
    });
    usePairings.mockReturnValue({
      setUri,
    });

    useBlockchainApplicationMeta.mockReturnValue({
      data: { data: mockApplicationsManage },
      isLoading: false,
      isFetching: false,
    });
  });

  it('Should mount correctly', () => {
    const wrapper = setup(context);
    expect(wrapper.find('input')).toHaveLength(1);
    expect(wrapper.find('button')).toHaveLength(1);
  });

  it('Should not setUri when the form has invalid input', () => {
    isValidWCURI.mockReturnValue(false);
    const wrapper = setup(context);
    wrapper.find('input').simulate('change', { target: { value: '0x123' } });
    wrapper.find('button').simulate('click');
    expect(setUri).not.toHaveBeenCalledWith();
    expect(isValidWCURI).toHaveBeenCalledWith('0x123');
    expect(wrapper.find('.feedbackErrorColor')).toHaveText('Invalid connection URI.');
  });

  it('Should not setUri when setUri returns error', () => {
    setUri.mockResolvedValue({
      status: 'FAILURE',
      message: 'Connection exits: wc:test',
    });
    const wrapper = setup(context);

    wrapper.find('input').simulate('change', { target: { value: 'wc:test' } });
    wrapper.find('button').simulate('click');
    expect(setUri).not.toHaveBeenCalledWith();
    expect(isValidWCURI).toHaveBeenCalledWith('wc:test');
    expect(wrapper.find('button')).toBeDisabled();
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
