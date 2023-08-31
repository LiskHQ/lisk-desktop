import React from 'react';
import { shallow } from 'enzyme';
import MultiStep from '@common/components/OldMultiStep';
import TxSignatureCollector from '@transaction/components/TxSignatureCollector';
import Dialog from 'src/theme/dialog/dialog';
import { RequestSignMessageConfirmation } from '@blockchainApplication/connection/components/RequestSignMessageDialog/RequestSignMessageConfirmation';
import SignedMessage from '@message/components/signedMessage';
import { useSession } from '@libs/wcm/hooks/useSession';
import { context as defaultContext } from '@blockchainApplication/connection/__fixtures__/requestSummary';
import { useEvents } from '@libs/wcm/hooks/useEvents';
import { EVENTS } from '@libs/wcm/constants/lifeCycle';
import BlockchainAppDetailsHeader from '@blockchainApplication/explore/components/BlockchainAppDetailsHeader';
import { mountWithRouterAndQueryClient } from 'src/utils/testHelpers';
import mockSavedAccounts from '@tests/fixtures/accounts';
import mockApplicationsManage from '@tests/fixtures/blockchainApplicationsManage';
import { useAccounts, useCurrentAccount } from '@account/hooks';
import { codec, cryptography } from '@liskhq/lisk-client';
import * as accountUtils from '@wallet/utils/account';
import { useBlockchainApplicationMeta } from '@blockchainApplication/manage/hooks/queries/useBlockchainApplicationMeta';
import wallets from '@tests/constants/wallets';
import RequestSignMessageDialog from './index';

const address = mockSavedAccounts[0].metadata.address;
const [appManage1, appManage2] = mockApplicationsManage;
const mockSetCurrentAccount = jest.fn();
const mockCurrentAccount = mockSavedAccounts[0];
const reject = jest.fn();

jest.spyOn(codec.codec, 'decode');
jest.spyOn(cryptography.address, 'getLisk32AddressFromPublicKey').mockReturnValue(address);
jest.mock('@account/hooks/useCurrentAccount');

jest.mock('@blockchainApplication/manage/hooks/queries/useBlockchainApplicationMeta');
jest.mock('@libs/wcm/hooks/usePairings');
jest.mock('@libs/wcm/hooks/useSession');
jest.mock('@libs/wcm/hooks/useEvents');
jest.mock('@account/hooks/useAccounts');
jest.mock('@walletconnect/utils', () => ({
  getSdkError: jest.fn((str) => str),
}));

jest
  .spyOn(accountUtils, 'extractAddressFromPublicKey')
  .mockReturnValue(mockCurrentAccount.metadata.address);
useSession.mockReturnValue({ reject, sessionRequest: defaultContext.sessionRequest });

useCurrentAccount.mockReturnValue([mockCurrentAccount, mockSetCurrentAccount]);
useAccounts.mockReturnValue({
  getAccountByAddress: () => mockSavedAccounts[0],
});

useBlockchainApplicationMeta.mockReturnValue({
  data: { data: [appManage1, appManage2] },
  isLoading: false,
  isFetching: false,
});

useSession.mockReturnValue({ reject, sessionRequest: defaultContext.sessionRequest });
useEvents.mockReturnValue({
  events: [
    ...defaultContext.events,
    {
      name: EVENTS.SESSION_PROPOSAL,
      meta: {
        id: '1',
        params: {
          chainId: 'lisk:00000001',
          request: {
            params: {
              recipientChainID: '00000001',
            },
          },
        },
      },
    },
  ],
});

describe('RequestSignMessageDialog', () => {
  it('should render properly', () => {
    const wrapper = shallow(<RequestSignMessageDialog history={{}} />);

    expect(wrapper).toContainMatchingElement(Dialog);
    expect(wrapper).toContainMatchingElement(BlockchainAppDetailsHeader);
    expect(wrapper).toContainMatchingElement(MultiStep);
    expect(wrapper).toContainMatchingElement(RequestSignMessageConfirmation);
    expect(wrapper).toContainMatchingElement(TxSignatureCollector);
    expect(wrapper).toContainMatchingElement(SignedMessage);
  });

  it('should not crash when session or events are undefined', () => {
    useSession.mockReturnValue({});
    useEvents.mockReturnValue({ events: [] });

    const wrapper = shallow(<RequestSignMessageDialog history={{}} />);
    expect(wrapper).toContainMatchingElement(Dialog);
    expect(wrapper).toContainMatchingElement(BlockchainAppDetailsHeader);
    expect(wrapper).toContainMatchingElement(MultiStep);
    expect(wrapper).toContainMatchingElement(RequestSignMessageConfirmation);
    expect(wrapper).toContainMatchingElement(TxSignatureCollector);
    expect(wrapper).toContainMatchingElement(SignedMessage);
  });

  it('should hide header on password step', () => {
    useSession.mockReturnValue({});
    useEvents.mockReturnValue({
      events: [
        {
          name: EVENTS.SESSION_REQUEST,
          meta: {
            params: {
              chainId: 'lisk:00000001',
              request: {
                method: 'sign_transaction',
                params: {
                  message: 'test-message',
                  address: wallets.genesis.publicKey,
                },
              },
            },
          },
        },
      ],
    });

    const props = { history: {} };
    const wrapper = mountWithRouterAndQueryClient(RequestSignMessageDialog, {
      props,
    });
    wrapper.find('button').at(1).simulate('click');
    wrapper.find('.continue-btn').at(1).simulate('click');
    expect(wrapper).not.toContainMatchingElement(BlockchainAppDetailsHeader);
  });
});
