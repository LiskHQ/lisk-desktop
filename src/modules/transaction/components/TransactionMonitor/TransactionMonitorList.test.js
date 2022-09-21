import React from 'react';
import { shallow } from 'enzyme';
import { useSelector } from 'react-redux';
import { mountWithRouterAndQueryClient } from 'src/utils/testHelpers';
import { DEFAULT_LIMIT } from 'src/utils/monitor';
import { mockTransactions } from '../../__fixtures__';
import { useTransactions } from '../../hooks/queries';
import TransactionMonitorList from './TransactionMonitorList';

const mockFetchNextPage = jest.fn();
const mockAddUpdate = jest.fn();
const originalQuerySelector = document.querySelector;
const originalScrollY = window.scrollY;

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: jest.fn().mockReturnValue({ t: jest.fn((val) => val) }),
}));
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));
jest.mock('../../hooks/queries');

afterEach(() => {
  useSelector.mockClear();
  mockFetchNextPage.mockClear();
});

describe('Transactions monitor page', () => {
  const props = {
    history: {
      push: jest.fn(),
    },
  };
  const transactions = mockTransactions.data;
  const amountFrom = '1.3';
  const height = '1234';

  const successQueryObj = {
    data: {
      data: transactions.slice(0, 20),
      meta: {
        count: DEFAULT_LIMIT,
        offset: 0,
        total: transactions.length * 3,
      },
    },
    isLoading: false,
    error: undefined,
    hasNextPage: true,
    isFetching: false,
    fetchNextPage: mockFetchNextPage,
  };

  const errorQueryObj = {
    data: undefined,
    isLoading: false,
    error: {
      error: true,
      message: 'Loading failed',
    },
    hasNextPage: true,
    isFetching: false,
    fetchNextPage: mockFetchNextPage,
  };

  const updateQueryObj = {
    ...successQueryObj,
    hasUpdate: true,
    addUpdate: mockAddUpdate,
  };

  it('should render transactions list', () => {
    let wrapper = shallow(<TransactionMonitorList {...props} />);
    expect(wrapper.find('Row')).toHaveLength(0);
    useTransactions.mockReturnValue(successQueryObj);

    wrapper = mountWithRouterAndQueryClient(TransactionMonitorList, props);
    wrapper.update();
    expect(wrapper.find('TransactionRow')).toHaveLength(DEFAULT_LIMIT);
  });

  it('allows to load more transactions', () => {
    useTransactions.mockReturnValue(successQueryObj);
    const wrapper = mountWithRouterAndQueryClient(TransactionMonitorList, props);
    expect(wrapper.find('TransactionRow')).toHaveLength(20);
    wrapper.find('button.load-more').simulate('click');
    expect(mockFetchNextPage).toHaveBeenCalledTimes(1);
  });

  it('allows to load latest transactions', () => {
    const mockScrollIntoView = jest.fn().mockReturnValue(undefined);
    document.querySelector = jest.fn(() => ({
      getBoundingClientRect: jest.fn().mockReturnValue({ top: 80 }),
      scrollIntoView: mockScrollIntoView,
    }));
    useTransactions.mockReturnValue(updateQueryObj);
    const wrapper = mountWithRouterAndQueryClient(TransactionMonitorList, props);
    wrapper.update();
    wrapper.find('button.load-latest').simulate('click');
    expect(mockAddUpdate).toHaveBeenCalledTimes(1);
    document.querySelector = originalQuerySelector;
    window.scrollY = originalScrollY;
  });

  it('shows error if API failed', () => {
    const error = 'Loading failed';
    useTransactions.mockReturnValue(errorQueryObj);
    const wrapper = mountWithRouterAndQueryClient(TransactionMonitorList, props);
    expect(wrapper).toIncludeText(error);
  });

  it('allows to load more transactions when filtered', () => {
    useTransactions.mockReturnValue(successQueryObj);
    const wrapper = mountWithRouterAndQueryClient(TransactionMonitorList, props);

    wrapper.find('button.filter').simulate('click');
    wrapper
      .find('input.amountFromInput')
      .simulate('change', { target: { value: amountFrom, name: 'amountFrom' } });
    wrapper.find('form.filter-container').simulate('submit');
    wrapper.find('button.load-more').simulate('click');
    expect(mockFetchNextPage).toHaveBeenCalledTimes(1);
  });

  it('allows to filter transactions by more filters', () => {
    useTransactions.mockReturnValue(successQueryObj);
    const wrapper = mountWithRouterAndQueryClient(TransactionMonitorList, props);

    wrapper.find('button.filter').simulate('click');
    wrapper.find('.more-less-switch').simulate('click');
    wrapper.find('input.height').simulate('change', { target: { value: height } });
    wrapper.find('form.filter-container').simulate('submit');
    wrapper.find('button.load-more').simulate('click');

    expect(mockFetchNextPage).toHaveBeenCalledTimes(1);
  });

  it.skip('allows to reverse sort by clicking "Date" header', () => {
    let mockSortDirection = 'desc';
    props.changeSort = jest.fn();
    props.changeSort.mockImplementation(() => {
      mockSortDirection = mockSortDirection === 'desc' ? 'asc' : 'desc';
    });

    const wrapper = mountWithRouterAndQueryClient(TransactionMonitorList, props);
    wrapper.find('.sort-by.timestamp').simulate('click');

    // this was to test the component its self without the manager (manger can have its own test)
    expect(props.changeSort).toHaveBeenCalledWith('timestamp');
    expect(mockSortDirection).toBe('asc');

    wrapper.find('.sort-by.timestamp').simulate('click');
    expect(props.changeSort).toHaveBeenCalledWith('timestamp');
    expect(mockSortDirection).toBe('desc');
  });

  it('allows to clear the filter after filtering by height', () => {
    useTransactions.mockReturnValue(successQueryObj);
    const wrapper = mountWithRouterAndQueryClient(TransactionMonitorList, props);

    wrapper.find('button.filter').simulate('click');
    wrapper.find('.more-less-switch').simulate('click');
    wrapper.find('input.height').simulate('change', { target: { value: height } });
    wrapper.find('form.filter-container').simulate('submit');
    wrapper.find('span.clear-filter').simulate('click');
    expect(wrapper.find('TransactionRow')).toHaveLength(20);
  });
});
