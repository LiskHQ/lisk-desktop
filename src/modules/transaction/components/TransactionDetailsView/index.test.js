import React from 'react';
import moment from 'moment';
import { MemoryRouter } from 'react-router';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { truncateAddress } from '@wallet/utils/account';
import { useTokensBalance } from '@token/fungible/hooks/queries';
import { mockAppsTokens } from '@token/fungible/__fixtures__';
import i18n from 'src/utils/i18n/i18n';
import { renderWithRouter } from 'src/utils/testHelpers';
import { mockEvents, mockTransactions } from '../../__fixtures__';
import TransactionDetailView from '.';
import { useTransactionEvents, useTransactions } from '../../hooks/queries';

jest.mock('../../hooks/queries');
jest.mock('@token/fungible/hooks/queries');

describe('TransactionDetailsView', () => {
  let wrapper;
  const transaction = mockTransactions.data[0];
  const mockFetchEventNextPage = jest.fn();
  const mockFetchTransactionsNextPage = jest.fn();
  const props = {
    blockId: 1,
  };
  moment.locale(i18n.language);

  useTransactionEvents.mockReturnValue({
    data: { data: mockEvents.data.slice(0, 20) },
    isLoading: false,
    error: undefined,
    hasNextPage: true,
    isFetching: false,
    fetchNextPage: mockFetchEventNextPage,
  });
  useTransactions.mockReturnValue({
    data: { data: [transaction] },
    isLoading: false,
    hasNextPage: false,
    isFetching: false,
    fetchNextPage: mockFetchTransactionsNextPage,
  });

  useTokensBalance.mockReturnValue({ data: mockAppsTokens });

  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = renderWithRouter(TransactionDetailView, props);
  });

  it('should display Transaction Events properly', async () => {
    expect(screen.getByText('Index')).toBeTruthy();
    expect(screen.getByText('Module')).toBeTruthy();
    expect(screen.getByText('Name')).toBeTruthy();

    mockEvents.data.slice(0, 20).forEach((item) => {
      expect(screen.queryAllByText(item.index)).toBeTruthy();
      expect(screen.queryAllByText(item.name)).toBeTruthy();
      expect(screen.queryAllByText(item.module)).toBeTruthy();
    });

    fireEvent.click(screen.getByText('Load more'));

    await waitFor(() => {
      expect(mockFetchEventNextPage).toHaveBeenCalled();
    });

    expect(screen.getByText(`Transaction details`)).toBeTruthy();
    expect(screen.getByText('Details')).toBeTruthy();
    expect(screen.getByText('Events')).toBeTruthy();
  });

  it('should display Transaction Events properly', async () => {
    expect(screen.getByText('Type')).toBeTruthy();
    expect(screen.getByText('Sender')).toBeTruthy();
    expect(screen.getByText('Fee')).toBeTruthy();
    expect(screen.getByText('Date')).toBeTruthy();
    expect(screen.getByText('Nonce')).toBeTruthy();
    expect(screen.getByText('Block status')).toBeTruthy();
    expect(screen.getByText('Status')).toBeTruthy();
    expect(screen.getByText('ID')).toBeTruthy();
    expect(screen.getByText('Block ID')).toBeTruthy();
    expect(screen.getByText('Block height')).toBeTruthy();
    expect(screen.getByText('Parameters')).toBeTruthy();

    const [moduleName, txType] = transaction.moduleCommand.split(':');
    expect(screen.getByText(`${moduleName} ${txType}`)).toBeTruthy();
    expect(screen.getByText(truncateAddress(transaction.sender.address))).toBeTruthy();
    expect(screen.getByText(transaction.sender.name)).toBeTruthy();
    expect(screen.getByText(transaction.nonce)).toBeTruthy();
    expect(screen.getByText(transaction.block.isFinal ? 'Final' : 'Not final')).toBeTruthy();
    expect(screen.getByText(transaction.executionStatus)).toBeTruthy();
    expect(screen.getByText(transaction.id)).toBeTruthy();
    expect(screen.getByText(transaction.block.id)).toBeTruthy();
    expect(screen.getByText(transaction.block.height)).toBeTruthy();
    expect(screen.getByText('0.01 LSK')).toBeTruthy();
    expect(
      screen.getByText(moment(transaction.block.timestamp * 1000).format('DD MMM YYYY, hh:mm:ss A'))
    ).toBeTruthy();

    expect(screen.getByText('Expand')).toBeTruthy();
    expect(screen.queryByTestId('transaction-param-json-viewer').className).toContain('shrink');

    fireEvent.click(screen.getByText('Expand'));

    expect(screen.getByText('Close')).toBeTruthy();
    await waitFor(() => {
      expect(screen.queryByTestId('transaction-param-json-viewer').className).not.toContain(
        'shrink'
      );
    });
  });

  it('should display transaction not found if transaction is empty', async () => {
    useTransactions.mockReturnValue({
      isLoading: false,
      hasNextPage: false,
      isFetching: false,
      fetchNextPage: mockFetchTransactionsNextPage,
    });

    wrapper = renderWithRouter(TransactionDetailView, props);
    expect(screen.getByText('The transaction was not found.')).toBeTruthy();
    expect(
      screen.getByText(
        'If you just made the transaction, it will take up to a few minutes to be included in the blockchain. Please open this page later.'
      )
    ).toBeTruthy();
  });

  it('should display transaction not found if there is an error', async () => {
    useTransactions.mockReturnValue({
      isLoading: false,
      hasNextPage: false,
      error: 'error',
      isFetching: false,
      fetchNextPage: mockFetchTransactionsNextPage,
    });

    wrapper.rerender(
      <MemoryRouter initialEntries={['/']}>
        <TransactionDetailView {...props} />)
      </MemoryRouter>
    );
    expect(screen.getByText('The transaction was not found.')).toBeTruthy();
    expect(
      screen.getByText(
        'If you just made the transaction, it will take up to a few minutes to be included in the blockchain. Please open this page later.'
      )
    ).toBeTruthy();
  });
});
