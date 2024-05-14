import { codec, cryptography, validator } from '@liskhq/lisk-client';
import { renderWithQueryClientAndWC } from 'src/utils/testHelpers';
import { screen, fireEvent } from '@testing-library/react';
import { useSession } from '@libs/wcm/hooks/useSession';
import { useEvents } from '@libs/wcm/hooks/useEvents';
import mockSavedAccounts from '@tests/fixtures/accounts';
import * as accountUtils from '@wallet/utils/account';
import { EVENTS } from '@libs/wcm/constants/lifeCycle';
import { useBlockchainApplicationMeta } from '@blockchainApplication/manage/hooks/queries/useBlockchainApplicationMeta';
import { useAppsMetaTokens } from '@token/fungible/hooks/queries/useAppsMetaTokens';
import mockApplicationsManage from '@tests/fixtures/blockchainApplicationsManage';
import { mockAppTokens } from '@tests/fixtures/token';
import { useCommandSchema } from '@network/hooks/useCommandsSchema';
import { useCurrentAccount } from '@account/hooks/useCurrentAccount';
import wallets from '@tests/constants/wallets';
import { useAccounts } from '@account/hooks';
import { useCurrentApplication } from 'src/modules/blockchainApplication/manage/hooks';
import { mockCommandParametersSchemas } from 'src/modules/common/__fixtures__';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
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
const mockSetCurrentAccount = jest.fn();
const mockCurrentAccount = mockSavedAccounts[0];

jest.mock('@blockchainApplication/manage/hooks/queries/useBlockchainApplicationMeta');
jest.mock('@token/fungible/hooks/queries/useAppsMetaTokens');
jest.mock('@libs/wcm/hooks/useSession');
jest.mock('@libs/wcm/hooks/useEvents');
jest.mock('@account/hooks/useAccounts');
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
jest.spyOn(codec.codec, 'decode');
jest.spyOn(cryptography.address, 'getLisk32AddressFromPublicKey').mockReturnValue(address);
jest.spyOn(validator.validator, 'validate').mockReturnValue(true);
jest.mock('@account/hooks/useCurrentAccount');
jest.mock('@blockchainApplication/manage/hooks');
jest.mock('src/utils/searchParams', () => ({
  ...jest.requireActual('src/utils/searchParams'),
  addSearchParamsToUrl: jest.fn(),
}));

useCurrentAccount.mockReturnValue([mockCurrentAccount, mockSetCurrentAccount]);
useCurrentApplication.mockReturnValue([mockApplicationsManage[0]]);
useCommandSchema.mockReturnValue({
  moduleCommandSchemas: mockCommandParametersSchemas.data.commands.reduce(
    (result, { moduleCommand, schema }) => ({ ...result, [moduleCommand]: schema }),
    {}
  ),
});
useAccounts.mockReturnValue({
  getAccountByAddress: () => mockSavedAccounts[0],
  accounts: mockSavedAccounts,
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
  const mockRespond = jest.fn();
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

  jest
    .spyOn(accountUtils, 'extractAddressFromPublicKey')
    .mockReturnValue(mockCurrentAccount.metadata.address);
  useSession.mockReturnValue({
    reject,
    sessionRequest: defaultContext.sessionRequest,
    respond: mockRespond,
  });
  codec.codec.decode.mockReturnValue({});

  it('Display the requesting app information', () => {
    renderWithQueryClientAndWC(RequestSummary, { nextStep, history });
    expect(screen.getByAltText('logo')).toHaveAttribute('src', 'http://example.com/icon.png');
    expect(screen.getByText('Signature request')).toBeTruthy();
    expect(screen.getByText('test app')).toBeTruthy();
    expect(screen.getByRole('link')).toHaveAttribute('href', 'http://example.com');
  });

  it('Reject the request if the reject button is clicked', async () => {
    renderWithQueryClientAndWC(RequestSummary, { nextStep, history });
    const button = screen.getAllByRole('button')[0];
    fireEvent.click(button);
    expect(mockRespond).toHaveBeenCalled();
  });

  it('Normalize the rawTx object and send it to the next step', () => {
    renderWithQueryClientAndWC(RequestSummary, { nextStep, history });
    const button = screen.getAllByRole('button')[1];
    fireEvent.click(button);
    expect(nextStep).toHaveBeenCalled();
  });

  it('Should display a warning if current account is not the signing account', () => {
    jest
      .spyOn(accountUtils, 'extractAddressFromPublicKey')
      .mockReturnValue(wallets.empty_wallet.summary.address);

    renderWithQueryClientAndWC(RequestSummary, { nextStep, history });
    expect(screen.getByText('Switch to signing account')).toBeTruthy();
    expect(screen.getByTestId('switch-icon')).toBeTruthy();
    expect(screen.getByText('Please click on “Switch to signing account”')).toBeTruthy();
    expect(screen.getByText('to complete the request.')).toBeTruthy();
    expect(
      screen.getByText(
        `(${mockCurrentAccount.metadata.name} - ${accountUtils.truncateAddress(
          wallets.empty_wallet.summary.address
        )})`
      )
    ).toBeTruthy();
  });

  it('Should display a warning if signing account is not present', () => {
    jest
      .spyOn(accountUtils, 'extractAddressFromPublicKey')
      .mockReturnValue(wallets.testnet_guy.summary.address);

    useAccounts.mockReturnValue({
      getAccountByAddress: () => null,
      accounts: mockSavedAccounts,
    });

    renderWithQueryClientAndWC(RequestSummary, {
      nextStep,
      history,
    });

    expect(screen.queryByText('Switch to signing account')).toBeFalsy();
    expect(screen.queryByText('switch-icon')).toBeFalsy();
    expect(screen.queryByText('Please click on “Switch to signing account”')).toBeFalsy();
    expect(screen.queryByText('to complete the request.')).toBeFalsy();
    expect(
      screen.queryByText(
        `(${mockCurrentAccount.metadata.name} - ${accountUtils.truncateAddress(
          wallets.empty_wallet.summary.address
        )})`
      )
    ).toBeFalsy();

    expect(
      screen.getByText(
        'The selected account for signing the requested transaction is missing. Please add the missing account “'
      )
    ).toBeTruthy();
    expect(
      screen.getByText(
        '” to Lisk Desktop and re-initiate the transaction signing from the external application.'
      )
    ).toBeTruthy();
  });

  it('Should display an error if signing application is not present', () => {
    useCurrentApplication.mockReturnValue([mockApplicationsManage[1]]);

    renderWithQueryClientAndWC(RequestSummary, {
      nextStep,
      history,
      message: 'X3CUgCGzyn43DTAbUKnTMDzcGWMooJT2hPSZinjfN1QUgVNYYfeoJ5zg6i4Nc5oon83a2VWEZCW',
    });

    expect(
      screen.getByText('Invalid signature request initiated from another application/network.')
    ).toBeTruthy();
    expect(
      screen.getByText(
        'Please switch application/network to selected value during connection initialization'
      )
    ).toBeTruthy();
  });

  it('Should not display content', () => {
    jest
      .spyOn(accountUtils, 'extractAddressFromPublicKey')
      .mockReturnValue(wallets.testnet_guy.summary.address);

    useAccounts.mockReturnValue({
      getAccountByAddress: () => null,
      accounts: [],
    });

    renderWithQueryClientAndWC(RequestSummary, { nextStep, history });

    expect(screen.queryByText('Signature request')).toBeFalsy();
    expect(screen.queryByText('test app')).toBeFalsy();
  });

  it('Should call history.push when clicking Add account', () => {
    useAccounts.mockReturnValue({
      getAccountByAddress: () => null,
      accounts: mockSavedAccounts,
    });
    renderWithQueryClientAndWC(RequestSummary, {
      nextStep,
      history,
      message: 'X3CUgCGzyn43DTAbUKnTMDzcGWMooJT2hPSZinjfN1QUgVNYYfeoJ5zg6i4Nc5oon83a2VWEZCW',
    });
    const button = screen.getByText('Add account');
    fireEvent.click(button);
    expect(history.push).toHaveBeenCalled();
  });

  it('redirects to NoAccountView if no account is found', () => {
    useAccounts.mockReturnValue({
      getAccountByAddress: () => null,
      accounts: [],
    });
    renderWithQueryClientAndWC(RequestSummary, {
      nextStep,
      history,
      message: 'X3CUgCGzyn43DTAbUKnTMDzcGWMooJT2hPSZinjfN1QUgVNYYfeoJ5zg6i4Nc5oon83a2VWEZCW',
    });
    expect(addSearchParamsToUrl).toHaveBeenCalledWith(history, {
      modal: 'NoAccountView',
      mode: 'EMPTY_ACCOUNT_LIST',
    });
  });
});
