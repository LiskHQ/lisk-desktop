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
    },
  };

  it('should render transactions list', () => {
    const wrapper = mount(<Transactions {...props} />);
    expect(wrapper.find('TableRow.row')).toHaveLength(0);
    wrapper.setProps({
      transactions: {
        ...props.transactions,
        isLoading: false,
        data: transactions,
      },
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
});
