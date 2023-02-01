import React from 'react';
import { mount } from 'enzyme';
import Transactions from './TransactionResultList';

describe('Transactions', () => {
  const props = {
    t: v => v,
    transactions: [
      {
        params: {
          data: 'testing',
        },
        id: '123',
        type: 0,
        moduleAssetName: 'transfer',
      },
    ],
    onSelectedRow: jest.fn(),
    rowItemIndex: 0,
    updateRowItemIndex: jest.fn(),
  };

  it('should render properly empty transactions', () => {
    const wrapper = mount(<Transactions {...props} />);
    expect(wrapper).toContainMatchingElement('.transactions');
    expect(wrapper).toContainMatchingElement('.transactions-header');
    expect(wrapper).toContainMatchingElement('.transactions-subtitle');
    expect(wrapper).toContainMatchingElement('.transactions-content');
    expect(wrapper).toContainMatchingElement('.search-transaction-row');
  });

  it('should render properly with transactions data', () => {
    const newProps = { ...props };
    newProps.transactions = [
      {
        params: {
          data: 'testing',
        },
        id: '123',
        type: 0,
        moduleAssetName: 'transfer',
      },
    ];
    const wrapper = mount(<Transactions {...props} />);

    expect(wrapper).toContainMatchingElement('.transactions');
    expect(wrapper).toContainMatchingElement('.transactions-header');
    expect(wrapper).toContainMatchingElement('.transactions-subtitle');
    expect(wrapper).toContainMatchingElement('.transactions-content');
    expect(wrapper).toContainMatchingElement('.search-transaction-row');
  });

  it('should render properly with transactions data type 2', () => {
    const newProps = { ...props };
    newProps.transactions = [
      {
        params: {
          data: 'testing',
        },
        id: '123',
        type: 2,
        moduleAssetName: 'registerValidator',
      },
    ];
    const wrapper = mount(<Transactions {...props} />);

    expect(wrapper).toContainMatchingElement('.transactions');
    expect(wrapper).toContainMatchingElement('.transactions-header');
    expect(wrapper).toContainMatchingElement('.transactions-subtitle');
    expect(wrapper).toContainMatchingElement('.transactions-content');
    expect(wrapper).toContainMatchingElement('.search-transaction-row');
  });

  it('should render properly with transactions data type 3', () => {
    const newProps = { ...props };
    newProps.transactions = [
      {
        params: {
          data: 'testing',
        },
        id: '123',
        type: 3,
        moduleAssetName: 'stakeValidator',
      },
    ];
    const wrapper = mount(<Transactions {...props} />);

    expect(wrapper).toContainMatchingElement('.transactions');
    expect(wrapper).toContainMatchingElement('.transactions-header');
    expect(wrapper).toContainMatchingElement('.transactions-subtitle');
    expect(wrapper).toContainMatchingElement('.transactions-content');
    expect(wrapper).toContainMatchingElement('.search-transaction-row');
  });
});
