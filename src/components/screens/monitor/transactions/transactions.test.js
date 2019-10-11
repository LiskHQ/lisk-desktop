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
  const height = '1234';
  const transactionsWithData = {
    ...props.transactions,
    isLoading: false,
    data: transactions,
  };

  it('should render transactions list', () => {
    const wrapper = mount(<Transactions {...props} />);
    expect(wrapper.find('TableRow.row')).toHaveLength(0);
    wrapper.setProps({
      transactions: transactionsWithData,
    });
    wrapper.update();
    expect(wrapper.find('TableRow.row')).toHaveLength(transactions.length + 1);
  });

  it('allows to load more transactions', () => {
    const wrapper = mount(<Transactions {...props} />);
    wrapper.find('button.load-more').simulate('click');
    expect(props.transactions.loadData).toHaveBeenCalledWith(
      { offset: props.transactions.data.length },
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

  it('allows to filter transactions by more filters', () => {
    const wrapper = mount(<Transactions {...{ ...props, transactions: transactionsWithData }} />);

    wrapper.find('button.filter').simulate('click');
    wrapper.find('.more-less-switch').simulate('click');
    wrapper.find('input.height').simulate('change', { target: { value: height } });
    wrapper.find('form.filter-container').simulate('submit');
    wrapper.find('button.load-more').simulate('click');

    expect(props.transactions.loadData).toHaveBeenCalledWith({
      offset: transactions.length, height,
    });
  });

  it('allows to reverse sort by clicking "Date" header', () => {
    const wrapper = mount(<Transactions {...{ ...props, transactions: transactionsWithData }} />);
    wrapper.find('.sort-by.timestamp').simulate('click');
    expect(props.transactions.loadData).toHaveBeenCalledWith({ sort: 'timestamp:asc' });
    wrapper.find('.sort-by.timestamp').simulate('click');
    expect(props.transactions.loadData).toHaveBeenCalledWith({ sort: 'timestamp:desc' });
  });
});
