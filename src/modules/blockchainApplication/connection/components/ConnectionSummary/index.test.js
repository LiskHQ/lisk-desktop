import React from 'react';
import { act } from 'react-dom/test-utils';
import { mountWithRouter } from 'src/utils/testHelpers';
import { usePairings } from '@libs/wcm/hooks/usePairings';
import { useSession } from '@libs/wcm/hooks/useSession';
import { useEvents } from '@libs/wcm/hooks/useEvents';
import { EVENTS } from '@libs/wcm/constants/lifeCycle';
import ConnectionContext from '@libs/wcm/context/connectionContext';
import ConnectionSummary from './index';

jest.mock('@libs/wcm/hooks/usePairings');
jest.mock('@libs/wcm/hooks/useSession');
jest.mock('@libs/wcm/hooks/useEvents');
jest.mock('@account/hooks', () => ({
  useAccounts: jest.fn().mockImplementation(() => ({
    accounts: [{ metadata: { address: 'lskdxc4ta5j43jp9ro3f8zqbxta9fn6jwzjucw7yt' } }],
  })),
  useCurrentAccount: jest.fn(() => [
    { metadata: { address: 'lskdxc4ta5j43jp9ro3f8zqbxta9fn6jwzjucw7yt' } },
  ]),
}));

jest.mock('@walletconnect/utils', () => ({
  getSdkError: jest.fn((str) => str),
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

const setup = () => {
  const Component = () => (
    <ConnectionContext.Provider>
      <ConnectionSummary />
    </ConnectionContext.Provider>
  );

  return mountWithRouter(Component, {}, {});
};

describe('ConnectionSummary', () => {
  const approve = jest.fn(() => ({
    status: 'SUCCESS',
    data: proposal,
  }));
  const reject = jest.fn(() => ({
    status: 'SUCCESS',
    data: proposal,
  }));
  usePairings.mockReturnValue({ setUri: jest.fn() });
  useSession.mockReturnValue({ approve, reject });
  useEvents.mockReturnValue({ events: [{ name: EVENTS.SESSION_PROPOSAL, meta: proposal }] });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Display the connecting app information and connection summary', () => {
    const wrapper = setup();
    expect(wrapper.find('.chain-name-text').text()).toEqual(proposal.params.proposer.metadata.name);
    expect(wrapper.find('img').at(0).prop('src')).toEqual(
      proposal.params.proposer.metadata.icons[0]
    );
    expect(wrapper.find('.pairing-topic').text()).toEqual(proposal.params.pairingTopic);
    wrapper.find('.methods span').forEach((method, index) => {
      expect(method.text()).toEqual(proposal.params.requiredNamespaces.lisk.methods[index]);
    });
    wrapper.find('.events span').forEach((event, index) => {
      expect(event.text()).toEqual(proposal.params.requiredNamespaces.lisk.events[index]);
    });
  });

  it('Approve the connection if the approve button is clicked', () => {
    const proposalWithNoEvents = {
      params: {
        proposer: proposal.params.proposer,
        requiredNamespaces: {
          lisk: {
            chains: ['lsk:1'],
            events: [],
            methods: ['sign_transaction'],
          },
        },
        pairingTopic: '0x123',
      },
    };
    useEvents.mockReturnValue({ events: [{ name: EVENTS.SESSION_PROPOSAL, meta: proposalWithNoEvents }] });
    const wrapper = setup();
    wrapper.find('.events span').forEach((event) => {
      expect(event.text()).toEqual('-');
    });
    act(() => {
      wrapper
        .find('.select-all input')
        .at(0)
        .simulate('change', { target: { checked: true } });
    });
    wrapper.update();
    expect(wrapper.find('button').at(1)).not.toBeDisabled();
    act(() => {
      wrapper
        .find('.select-all input')
        .at(0)
        .simulate('change', { target: { checked: false } });
    });
    wrapper.update();
    expect(wrapper.find('button').at(1)).toBeDisabled();
    act(() => {
      wrapper
        .find('.select-all input')
        .at(0)
        .simulate('change', { target: { checked: true } });
    });
    wrapper.update();
    expect(wrapper.find('button').at(1)).not.toBeDisabled();
    wrapper.find('button').at(1).simulate('click');
    expect(approve).toHaveBeenCalled();
  });

  it('Select accounts on a random basis', () => {
    const wrapper = setup();
    expect(wrapper.find('button').at(1)).toBeDisabled();
    act(() => {
      wrapper.find('.accounts-list input').simulate('change', { target: { checked: true } });
    });
    wrapper.update();
    expect(wrapper.find('button').at(1)).not.toBeDisabled();
    act(() => {
      wrapper.find('.accounts-list input').simulate('change', { target: { checked: false } });
    });
    wrapper.update();
    expect(wrapper.find('button').at(1)).toBeDisabled();
  });

  it('Reject the connection if the reject button is clicked', () => {
    const wrapper = setup();
    wrapper.find('button').at(0).simulate('click');
    expect(reject).toHaveBeenCalled();
  });

  it("Proceeds to the status screen if event doesn't meet the criteria", () => {
    const wongProposal = {
      ...proposal,
    };
    delete wongProposal.params.proposer.metadata.name;
    useEvents.mockReturnValue({ events: [{ name: EVENTS.SESSION_PROPOSAL, meta: wongProposal }] });
    const wrapper = setup();
    wrapper.find('button').at(0).simulate('click');
    expect(reject).toHaveBeenCalled();
  });
});
