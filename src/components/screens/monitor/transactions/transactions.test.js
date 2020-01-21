import React from 'react';
import { mount } from 'enzyme';
import Transactions from './transactions';
import transactions from '../../../../../test/constants/transactions';

describe('Transactions monitor page', () => {
  const props = {
    t: key => key,
    transactions: {
      data: [],
      isLoading: true,
      loadData: jest.fn(),
      clearData: jest.fn(),
    },
  };
  const amountFrom = '1.3';
  const sort = 'timestamp:desc';
  const height = '1234';
  const transactionsWithData = {
    ...props.transactions,
    isLoading: false,
    data: transactions,
  };

  it('should render transactions list', () => {
    const wrapper = mount(<Transactions {...props} />);
    expect(wrapper.find('TransactionRow')).toHaveLength(0);
    wrapper.setProps({
      transactions: transactionsWithData,
    });
    wrapper.update();
    expect(wrapper.find('TransactionRow')).toHaveLength(transactions.length);
  });

  it('allows to load more transactions', () => {
    const wrapper = mount(<Transactions {... { ...props, transactions: transactionsWithData }} />);
    wrapper.find('button.load-more').simulate('click');
    expect(props.transactions.loadData).toHaveBeenCalledWith(
      { offset: transactionsWithData.data.length, sort },
    );
  });

  it('shows error if API failed', () => {
    const error = 'Loading failed';
    const wrapper = mount(<Transactions {...props} />);
    wrapper.setProps({
      transactions: {
        ...props.transactions,
        isLoading: false,
        error,
      },
    });
    expect(wrapper).toIncludeText(error);
  });

  it('allows to load more transactions when filtered', () => {
    const wrapper = mount(<Transactions {...{ ...props, transactions: transactionsWithData }} />);

    wrapper.find('button.filter').simulate('click');
    wrapper.find('input.amountFromInput').simulate('change', { target: { value: amountFrom, name: 'amountFrom' } });
    wrapper.find('form.filter-container').simulate('submit');
    wrapper.find('button.load-more').simulate('click');

    expect(props.transactions.loadData).toHaveBeenCalledWith({
      offset: transactions.length, amountFrom, sort,
    });
  });

  it('allows to filter transactions by more filters', () => {
    const wrapper = mount(<Transactions {...{ ...props, transactions: transactionsWithData }} />);

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
    const wrapper = mount(<Transactions {...{ ...props, transactions: transactionsWithData }} />);
    wrapper.find('.sort-by.timestamp').simulate('click');
    expect(props.transactions.loadData).toHaveBeenCalledWith({ sort: 'timestamp:asc' });
    wrapper.find('.sort-by.timestamp').simulate('click');
    expect(props.transactions.loadData).toHaveBeenCalledWith({ sort: 'timestamp:desc' });
  });

  it('allows to clear the filter after filtering by height', () => {
    const wrapper = mount(<Transactions {...props} />);
    wrapper.find('button.filter').simulate('click');
    wrapper.find('.more-less-switch').simulate('click');
    wrapper.find('input.height').simulate('change', { target: { value: height } });
    wrapper.find('form.filter-container').simulate('submit');
    wrapper.find('span.clear-filter').simulate('click');
    expect(props.transactions.loadData).toHaveBeenCalled();
  });

  // This should be handled using css
  it.skip('should modify address value on window resize', () => {
    const resizeWindow = (x, y) => {
      window.innerWidth = x;
      window.innerHeight = y;
      window.dispatchEvent(new Event('resize'));
    };

    const wrapper = mount(<Transactions {...{ ...props, transactions: transactionsWithData }} />);
    resizeWindow(600, 600);
    expect(wrapper.find('.addressValue').at(0)).toHaveText('60766...51L');
    resizeWindow(1500, 800);
    expect(wrapper.find('.addressValue').at(0)).toHaveText('6076671634347365051L');
  });
});
