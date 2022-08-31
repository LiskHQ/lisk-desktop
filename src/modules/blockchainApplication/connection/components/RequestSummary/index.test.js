import React from 'react';
import { mount } from 'enzyme';
import useSession from '@libs/wcm/hooks/useSession';
import { EVENTS } from '@libs/wcm/constants/lifeCycle';
import { rejectLiskRequest } from '@libs/wcm/utils/requestHandlers';
import ConnectionContext from '@libs/wcm/context/connectionContext';
import RequestSummary from './index';

const nextStep = jest.fn();

jest.mock('@libs/wcm/hooks/useSession');
jest.mock('@account/hooks', () => ({
  useAccounts: jest.fn().mockImplementation(() => ({
    accounts: [{ metadata: { address: 'lskdxc4ta5j43jp9ro3f8zqbxta9fn6jwzjucw7yt' } }],
  })),
}));
jest.mock('@transaction/utils/transaction', () => ({
  elementTxToDesktopTx: jest.fn().mockReturnValue({}),
  convertTxJSONToBinary: jest.fn().mockReturnValue({}),
}));
jest.mock('@walletconnect/utils', () => ({
  getSdkError: jest.fn(str => str),
}));
jest.mock('@libs/wcm/utils/requestHandlers', () => ({
  rejectLiskRequest: jest.fn(),
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
jest.mock('@transaction/api');

const setup = (context) => {
  const Component = () => (
    <ConnectionContext.Provider value={context}>
      <RequestSummary nextStep={nextStep} />
    </ConnectionContext.Provider>
  );

  return mount(<Component />);
};

const context = {
  events: [{
    name: EVENTS.SESSION_REQUEST,
    meta: {
      params: {
        chainId: 'lisk:2',
        request: {
          method: ['sign_transaction'],
          params: {
            rawTx: {
              moduleID: 2,
              commandID: 0,
              senderPublicKey: '6b40b2c68d52b1532d0374a078974798cff0b59d0a409a8d574378fe2c69daef',
              nonce: '52n',
              fee: '213000n',
              signatures: [],
              params: {
                recipientAddress: 'b778fc95b9f07407e6409d73c8af1919d9035002',
                amount: '910000n',
                data: '',
              },
              id: 'fd22e283b9901ab1b3f812b1f1c62b08325b1b43aef365d7895eeb58597b6614',
            },
          },
        },
      },
    },
  }],
  session: {
    request: {
      peer: {
        metadata: {
          icons: ['http://example.com/icon.png'],
          name: 'test app',
          url: 'http://example.com',
        },
      },
    },
  },
};

describe('RequestSummary', () => {
  const reject = jest.fn();
  useSession.mockReturnValue({ reject, session: context.session });

  it('Display the requesting app information', () => {
    const wrapper = setup(context);
    expect(wrapper.find('img').at(0).prop('src')).toEqual('http://example.com/icon.png');
    expect(wrapper.find('h2').text()).toEqual('sign_transaction');
    expect(wrapper.find('h3').text()).toEqual('test app');
    expect(wrapper.find('a').prop('href')).toEqual('http://example.com');
  });

  it('Reject the request if the reject button is clicked', () => {
    const wrapper = setup(context);
    wrapper.find('button').at(0).simulate('click');
    expect(rejectLiskRequest).toHaveBeenCalled();
  });

  it('Normalize the rawTx object and send it to the next step', () => {
    const wrapper = setup(context);
    wrapper.find('button').at(1).simulate('click');
    expect(nextStep).toHaveBeenCalled();
  });
});
