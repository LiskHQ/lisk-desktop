import React from 'react';
import { mount } from 'enzyme';
import Transactions from './transactions';

describe('Transactions', () => {
  let wrapper;

  const props = {
    t: v => v,
    transactions: [],
    onSelectedRow: jest.fn(),
  };

  beforeEach(() => {
    wrapper = mount(<Transactions {...props} />);
  });

  it('should render properly empty transactions', () => {
    expect(wrapper).toContainMatchingElement('.transactions');
    expect(wrapper).toContainMatchingElement('.transactions-header');
    expect(wrapper).toContainMatchingElement('.transactions-subtitle');
    expect(wrapper).toContainMatchingElement('.transactions-content');
    expect(wrapper).not.toContainMatchingElement('.transaction-row');
  });

  it('should render properly with transactions data', () => {
    const newProps = { ...props };
    newProps.transactions = [
      {
        asset: {
          data: 'testing',
        },
        id: 123,
        type: 0,
      },
    ];
    wrapper = mount(<Transactions {...newProps} />);

    expect(wrapper).toContainMatchingElement('.transactions');
    expect(wrapper).toContainMatchingElement('.transactions-header');
    expect(wrapper).toContainMatchingElement('.transactions-subtitle');
    expect(wrapper).toContainMatchingElement('.transactions-content');
    expect(wrapper).toContainMatchingElement('.transaction-row');
  });

  it('should render properly with transactions data type 2', () => {
    const newProps = { ...props };
    newProps.transactions = [
      {
        asset: {
          data: 'testing',
        },
        id: 123,
        type: 2,
      },
    ];
    wrapper = mount(<Transactions {...newProps} />);

    expect(wrapper).toContainMatchingElement('.transactions');
    expect(wrapper).toContainMatchingElement('.transactions-header');
    expect(wrapper).toContainMatchingElement('.transactions-subtitle');
    expect(wrapper).toContainMatchingElement('.transactions-content');
    expect(wrapper).toContainMatchingElement('.transaction-row');
  });

  it('should render properly with transactions data type 3', () => {
    const newProps = { ...props };
    newProps.transactions = [
      {
        asset: {
          data: 'testing',
        },
        id: 123,
        type: 3,
      },
    ];
    wrapper = mount(<Transactions {...newProps} />);

    expect(wrapper).toContainMatchingElement('.transactions');
    expect(wrapper).toContainMatchingElement('.transactions-header');
    expect(wrapper).toContainMatchingElement('.transactions-subtitle');
    expect(wrapper).toContainMatchingElement('.transactions-content');
    expect(wrapper).toContainMatchingElement('.transaction-row');
  });

  it('should call onClick function on selected row', () => {
    const newProps = { ...props };
    newProps.transactions = [
      {
        asset: {
          data: 'testing',
        },
        id: 123,
        type: 1,
      },
    ];
    wrapper = mount(<Transactions {...newProps} />);

    wrapper.find('.transaction-row').at(0).simulate('click');
    expect(props.onSelectedRow).toBeCalled();
  });
});
