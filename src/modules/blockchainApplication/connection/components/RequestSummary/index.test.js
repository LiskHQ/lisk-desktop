import { cryptography } from '@liskhq/lisk-client';
import { renderWithQueryClientAndWC } from 'src/utils/testHelpers';
import { screen, fireEvent } from '@testing-library/react';
import { useSession } from '@libs/wcm/hooks/useSession';
import { useEvents } from '@libs/wcm/hooks/useEvents';
import mockSavedAccounts from '@tests/fixtures/accounts';
import { EVENTS } from '@libs/wcm/constants/lifeCycle';
import { useBlockchainApplicationMeta } from '@blockchainApplication/manage/hooks/queries/useBlockchainApplicationMeta';
import { useAppsMetaTokens } from '@token/fungible/hooks/queries/useAppsMetaTokens';
import mockApplicationsManage from '@tests/fixtures/blockchainApplicationsManage';
import { mockAppTokens } from '@tests/fixtures/token';
import { useCommandSchema } from '@network/hooks/useCommandsSchema';
import { mockCommandParametersSchemas } from 'src/modules/common/__fixtures__';
import { context as defaultContext } from '../../__fixtures__/requestSummary';
import RequestSummary from './index';

const nextStep = jest.fn();
const history = {
  location: {
    search: '?requestId=1',
  },
  push: jest.fn(),
};
const address = mockSavedAccounts[0].metadata.address;
const [appManage1, appManage2] = mockApplicationsManage;

jest.mock('@blockchainApplication/manage/hooks/queries/useBlockchainApplicationMeta');
jest.mock('@token/fungible/hooks/queries/useAppsMetaTokens');
jest.mock('@libs/wcm/hooks/useSession');
jest.mock('@libs/wcm/hooks/useEvents');
jest.mock('@account/hooks/useAccounts', () => ({
  useAccounts: jest.fn().mockImplementation(() => ({
    accounts: [mockSavedAccounts],
    getAccountByAddress: jest.fn(() => mockSavedAccounts[0]),
  })),
}));
jest.mock('@transaction/utils/transaction', () => ({
  elementTxToDesktopTx: jest.fn().mockReturnValue({}),
  convertTxJSONToBinary: jest.fn().mockReturnValue({}),
}));
jest.mock('@walletconnect/utils', () => ({
  getSdkError: jest.fn((str) => str),
}));
jest.mock('@libs/wcm/utils/connectionCreator', () => ({
  createSignClient: jest.fn(() => Promise.resolve()),
  client: {
    pair: jest.fn(),
  },
}));

jest.mock('@network/hooks/useCommandsSchema');
jest.mock('@account/hooks/useDeprecatedAccount', () => ({
  useDeprecatedAccount: jest.fn(),
}));
jest.mock('@transaction/hooks/queries/useSchemas', () => ({
  useSchemas: jest.fn(),
}));
jest.spyOn(cryptography.address, 'getLisk32AddressFromPublicKey').mockReturnValue(address);

useCommandSchema.mockReturnValue({
  moduleCommandSchemas: mockCommandParametersSchemas.data.commands.reduce(
    (result, { moduleCommand, schema }) => ({ ...result, [moduleCommand]: schema }),
    {}
  ),
});
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

describe('RequestSummary', () => {
  const reject = jest.fn();
  beforeEach(() => {
    useBlockchainApplicationMeta.mockReturnValue({
      data: {
        data: [appManage1, appManage2],
      },
      isLoading: false,
      isFetching: false,
    });
    useAppsMetaTokens.mockReturnValue({
      data: {
        data: mockAppTokens,
      },
      isLoading: false,
      isFetching: false,
    });
  });
  useSession.mockReturnValue({ reject, sessionRequest: defaultContext.sessionRequest });

  it('Display the requesting app information', () => {
    renderWithQueryClientAndWC(RequestSummary, { nextStep, history });
    expect(screen.getByTestId('logo')).toHaveAttribute('src', 'http://example.com/icon.png');
    expect(screen.getByText('Signature request')).toBeTruthy();
    expect(screen.getByText('test app')).toBeTruthy();
    expect(screen.getByRole('link')).toHaveAttribute('href', 'http://example.com');
  });

  it('Reject the request if the reject button is clicked', () => {
    renderWithQueryClientAndWC(RequestSummary, { nextStep, history });
    const button = screen.getAllByRole('button')[0];
    fireEvent.click(button);
    expect(history.push).toHaveBeenCalled();
  });

  it.skip('Normalize the rawTx object and send it to the next step', () => {
    renderWithQueryClientAndWC(RequestSummary, { nextStep, history });
    const button = screen.getAllByRole('button')[1];
    fireEvent.click(button);
    expect(nextStep).toHaveBeenCalled();
  });
});
