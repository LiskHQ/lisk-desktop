import React from 'react';
import { shallow } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { useSelector } from 'react-redux';
import { mountWithRouter, mountWithRouterAndStore } from '@common/utilities/testHelpers';
import transactions from '@tests/constants/transactions';
import defaultState from '@tests/constants/defaultState';
import TransactionMonitorList from './TransactionMonitorList';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

afterEach(() => {
  useSelector.mockClear();
});

describe('Transactions monitor page', () => {
  const changeSort = jest.fn();
  const filters = jest.fn();
  const clearFilter = jest.fn();
  const applyFilters = jest.fn();
  const clearAllFilters = jest.fn();
  const t = jest.fn(str => str);
  const loadData = jest.fn();
  const clearData = jest.fn();
  const props = {
    t,
    transactions: {
      data: [],
      meta: null,
      isLoading: true,
      loadData,
      clearData,
    },
    changeSort,
    filters,
    clearFilter,
    applyFilters,
    clearAllFilters,
  };
  const amountFrom = '1.3';
  const sort = 'timestamp:desc';
  const height = '1234';
  const transactionsWithData = {
    ...props.transactions,
    isLoading: false,
    data: transactions,
    meta: {
      count: transactions.length,
      offset: 0,
      total: transactions.length * 3,
    },
  };

  it('should render transactions list', () => {
    let wrapper = shallow(<TransactionMonitorList {...props} />);
    expect(wrapper.find('Row')).toHaveLength(0);

    wrapper = mountWithRouter(TransactionMonitorList, {
      ...{
        ...props,
        transactions: transactionsWithData,
      },
    });
    wrapper.update();
    expect(wrapper.find('TransactionRow')).toHaveLength(transactions.length);
  });

  it('allows to load more transactions', () => {
    const wrapper = mountWithRouter(
      TransactionMonitorList,
      {
        ...props,
        transactions: transactionsWithData,
        sort,
        filters: {},
      },
    );
    wrapper.find('button.load-more').simulate('click');
    expect(props.transactions.loadData).toHaveBeenCalledWith(
      { offset: transactionsWithData.data.length, sort },
    );
  });

  it.skip('allows to load latest transactions', () => {
    const newState = {
      ...defaultState,
      blocks: {
        ...defaultState.blocks,
        latestBlocks: [
          { height: 123123124, numberOfTransactions: 2 },
          { height: 123123126, numberOfTransactions: 5 },
          { height: 123123127, numberOfTransactions: 6 },
        ],
      },
    };
    const wrapper = mountWithRouterAndStore(
      TransactionMonitorList,
      { ...props, transactions: transactionsWithData },
      {},
      defaultState,
    );
    wrapper.update();
    // simulate new transactions
    // mock selector used in transactions table
    useSelector.mockImplementation(callback => callback(newState));
    // store.dispatch({
    //   type: actionTypes.newBlockCreated,
    //   data: {
    //     block: { height: 123123126, numberOfTransactions: 5 },
    //   },
    // });
    // store.dispatch({
    //   type: actionTypes.newBlockCreated,
    //   data: {
    //     block: { height: 123123127, numberOfTransactions: 6 },
    //   },
    // });
    act(() => { wrapper.update(); });
    wrapper.find('button.load-latest').simulate('click');
    expect(props.transactions.loadData).toHaveBeenCalled();
  });

  it('shows error if API failed', () => {
    const error = 'Loading failed';
    const wrapper = mountWithRouter(TransactionMonitorList, {
      ...props,
      transactions: {
        ...props.transactions,
        isLoading: false,
        error,
      },
    });
    expect(wrapper).toIncludeText(error);
  });

  it('allows to load more transactions when filtered', () => {
    props.transactions.loadData = jest.fn();
    transactionsWithData.loadData = props.transactions.loadData;

    const wrapper = mountWithRouter(
      TransactionMonitorList,
      {
        ...props,
        transactions: transactionsWithData,
        filters: { amountFrom: '1.3', moduleAssetId: '' },
        sort,
      },
    );

    wrapper.find('button.filter').simulate('click');
    wrapper.find('input.amountFromInput').simulate('change', { target: { value: amountFrom, name: 'amountFrom' } });
    wrapper.find('form.filter-container').simulate('submit');
    wrapper.find('button.load-more').simulate('click');

    expect(props.transactions.loadData).toHaveBeenCalledWith({
      offset: transactions.length, amountFrom, sort,
    });
  });

  it('allows to filter transactions by more filters', () => {
    props.transactions.loadData = jest.fn();
    transactionsWithData.loadData = props.transactions.loadData;

    const wrapper = mountWithRouter(
      TransactionMonitorList,
      {
        ...props,
        transactions: transactionsWithData,
        sort,
        filters: { height, moduleAssetId: '' },
      },
    );

    wrapper.find('button.filter').simulate('click');
    wrapper.find('.more-less-switch').simulate('click');
    wrapper.find('input.height').simulate('change', { target: { value: height } });
    wrapper.find('form.filter-container').simulate('submit');
    wrapper.find('button.load-more').simulate('click');

    expect(props.transactions.loadData).toHaveBeenCalledWith({
      offset: transactions.length, height, sort,
    });
  });

  it('allows to reverse sort by clicking "Date" header', () => {
    let mockSortDirection = 'desc';
    props.changeSort = jest.fn();
    props.changeSort.mockImplementation(() => {
      mockSortDirection = mockSortDirection === 'desc' ? 'asc' : 'desc';
    });

    const wrapper = mountWithRouter(
      TransactionMonitorList,
      { ...props, transactions: transactionsWithData },
    );
    wrapper.find('.sort-by.timestamp').simulate('click');

    // this was to test the component its self without the manager (manger can have its own test)
    expect(props.changeSort).toHaveBeenCalledWith('timestamp');
    expect(mockSortDirection).toBe('asc');

    wrapper.find('.sort-by.timestamp').simulate('click');
    expect(props.changeSort).toHaveBeenCalledWith('timestamp');
    expect(mockSortDirection).toBe('desc');
  });

  it('allows to clear the filter after filtering by height', () => {
    const wrapper = mountWithRouter(TransactionMonitorList, {
      ...props,
      filters: { height },
    });

    wrapper.find('button.filter').simulate('click');
    wrapper.find('.more-less-switch').simulate('click');
    wrapper.find('input.height').simulate('change', { target: { value: height } });
    wrapper.find('form.filter-container').simulate('submit');
    wrapper.find('span.clear-filter').simulate('click');
    expect(props.transactions.loadData).toHaveBeenCalled();
  });
});
