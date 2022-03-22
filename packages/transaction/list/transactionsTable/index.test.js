import { mountWithRouter } from '@common/utilities/testHelpers';
import { expect } from 'chai';
import TransactionsTable from './index';
import transactionsData from '../../../../test/fixtures/transactionsData';

const mockLoadMore = jest.fn();
const filters = {
  dateFrom: '',
  dateTo: '',
  amountFrom: '',
  amountTo: '',
  moduleAssetId: '',
  height: '',
  recipientAddress: '',
  senderAddress: '',
};

const fields = [{
  label: 'Date range',
  name: 'date',
  type: 'date-range',
}, {
  label: 'Amount range',
  name: 'amount',
  type: 'number-range',
}, {
  label: 'Sender',
  placeholder: 'Address or public key',
  name: 'senderAddress',
  type: 'address',
}, {
  label: 'Recipient',
  placeholder: 'Address or public key',
  name: 'recipientAddress',
  type: 'address',
}, {
  label: 'Type',
  placeholder: 'All types',
  name: 'moduleAssetId',
  type: 'select',
}, {
  label: 'Height',
  placeholder: 'e.g. 10180477',
  name: 'height',
  type: 'integer',
}];

const transactions = {
  error: '',
  isLoading: false,
  urlSearchParams: {},
  meta: {
    offset: 0,
    count: transactionsData.length,
    total: transactionsData.length,
  },
  loadData: mockLoadMore,
  data: transactionsData,
};

const transactionTableProps = {
  filters,
  fields,
  transactions,
  isLoadMoreEnabled: false,
  canLoadMore: transactions.meta ? transactions.data.length < transactions.meta.total : false,
  title: 'All transactions',
};

let wrapper = null;

describe('Transactions table filtering and rendering', () => {
  beforeEach(() => {
    wrapper = mountWithRouter(TransactionsTable, transactionTableProps);
  });

  it('should render all transactions by default', () => {
    const transactionRows = wrapper.find('div.row.row.transactions-row');
    expect(transactionRows).to.lengthOf(transactionsData.length);
  });

  it('should not display amount and recepient fields for non-balance related transactions', () => {
    wrapper.find('button.filterTransactions').simulate('click');
    let filterFormInnerText = wrapper.find('form.filter-container').text();

    expect(filterFormInnerText).to.contain('Amount range');
    expect(filterFormInnerText).to.contain('Date range');
    expect(filterFormInnerText).to.contain('Sender');

    wrapper.find('span.more-less-switch').simulate('click');
    filterFormInnerText = wrapper.find('form.filter-container').text();

    expect(filterFormInnerText).to.contain('Recipient');
    expect(filterFormInnerText).to.contain('Type');
    expect(filterFormInnerText).to.contain('Height');

    const transactionOptions = wrapper.find('div.transaction-options').simulate('click');
    transactionOptions.find('span.option[value="5:1"]').simulate('click', { target: { getAttribute: () => '5:1' } });
    filterFormInnerText = wrapper.find('form.filter-container').text();

    expect(filterFormInnerText).to.not.contain('Amount range');
    expect(filterFormInnerText).to.not.contain('Recipient');
  });

  it('should not be able to sort by amount for non-balance related transactions', () => {
    wrapper.find('button.filterTransactions').simulate('click');
    wrapper.find('span.more-less-switch').simulate('click');
    wrapper.find('div.transaction-options').simulate('click');
    wrapper.find('span.option[value="5:1"]').simulate('click', { target: { getAttribute: () => '5:1' } });
    wrapper.find('form.filter-container').simulate('submit');

    expect(wrapper.find('span.sort-by.amount')).to.not.contain('Amount');
  });
});
