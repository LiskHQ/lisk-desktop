import React from 'react';
import { mountWithRouter } from 'src/utils/testHelpers';
import usePairings from '@libs/wcm/hooks/usePairings';
import useSession from '@libs/wcm/hooks/useSession';
import { EVENTS } from '@libs/wcm/constants/lifeCycle';
import ConnectionContext from '@libs/wcm/context/connectionContext';
import ConnectionSummary from './index';
import { act } from 'react-dom/test-utils';

jest.mock('@libs/wcm/hooks/usePairings');
jest.mock('@libs/wcm/hooks/useSession');
jest.mock('@account/hooks', () => ({
  useAccounts: jest.fn().mockImplementation(() => ({
    accounts: [{ metadata: { address: 'lskdxc4ta5j43jp9ro3f8zqbxta9fn6jwzjucw7yt' } }],
  })),
}));

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

const setup = (context) => {
  const Component = () => (
    <ConnectionContext.Provider value={context}>
      <ConnectionSummary />
    </ConnectionContext.Provider>
  );

  return mountWithRouter(Component, {}, {});
};

describe('ConnectionSummary', () => {
  const approve = jest.fn();
  const reject = jest.fn();
  usePairings.mockReturnValue({ setUri: jest.fn() });
  useSession.mockReturnValue({ approve, reject });

  const proposal = {
    params: {
      proposer: {
        metadata: {
          name: 'Proposer name',
          url: 'http://example.com',
          icons: ['http://example.com/icon.png'],
        },
      },
      requiredNamespaces: {
        lisk: {
          chains: ['lsk:1'],
          events: ['sign_transaction'],
          methods: ['receive_token'],
        },
      },
      pairingTopic: '0x123',
    },
  };
  const context = {
    events: [{ name: EVENTS.SESSION_PROPOSAL, meta: proposal }],
  };

  it('Display the connecting app information and connection summary', () => {
    const wrapper = setup(context);
    expect(wrapper.find('.chain-name-text').text()).toEqual(proposal.params.proposer.metadata.name);
    expect(wrapper.find('img').at(0).prop('src')).toEqual(proposal.params.proposer.metadata.icons[0]);
    // expect(wrapper.find('.accounts').text()).toEqual(proposal.params.accounts[0].address);
    expect(wrapper.find('.pairing-topic').text()).toEqual(proposal.params.pairingTopic);
    wrapper.find('.methods span').forEach((method, index) => {
      expect(method.text()).toEqual(proposal.params.requiredNamespaces.lisk.methods[index]);
    });
    wrapper.find('.events span').forEach((event, index) => {
      expect(event.text()).toEqual(proposal.params.requiredNamespaces.lisk.events[index]);
    });
  });

  it('Approve the connection if the approve button is clicked', () => {
    const wrapper = setup(context);
    act(() => {
      wrapper.find('.select-all input').at(0).simulate('change');
    });
    wrapper.update();
    expect(wrapper.find('button').at(1)).not.toBeDisabled();
    wrapper.find('button').at(1).simulate('click');
    expect(approve).toHaveBeenCalled();
  });

  it('Reject the connection if the reject button is clicked', () => {
    const wrapper = setup(context);
    wrapper.find('button').at(0).simulate('click');
    expect(reject).toHaveBeenCalled();
  });
});
