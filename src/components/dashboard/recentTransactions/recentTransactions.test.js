import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter as Router } from 'react-router-dom';
import RecentTransactions from './recentTransactions';


describe('Recent Transactions', () => {
  let wrapper;

  const lskProps = {
    account: {
      address: '123456L',
    },
    loadTransactions: jest.fn(),
    bookmarks: {
      LSK: [
        {
          id: 0,
          address: '2435345L',
          title: 'saved account',
          amount: '0.001',
          type: 0,
        },
      ],
      BTC: [],
    },
    settings: {
      token: {
        active: 'LSK',
      },
    },
    transactions: [
      {
        id: 0,
        recipientId: '123456L',
        amount: '0.001',
        token: 'LSK',
        type: 0,
      },
      {
        id: 1,
        recipientId: '2435345L',
        amount: '0.0003',
        token: 'LSK',
        type: 4,
      },
      {
        id: 2,
        recipientId: '123456L',
        amount: '0.008',
        token: 'LSK',
        type: 1,
      },
      {
        id: 3,
        recipientId: '234234234L',
        amount: '0.0009',
        token: 'LSK',
        type: 2,
      },
      {
        id: 4,
        recipientId: '4564346346L',
        amount: '25',
        token: 'LSK',
        type: 3,
      },
    ],
    isLoggedIn: true,
    t: key => key,
  };

  const btcProps = {
    account: {
      address: 'mkakDp2f31btaXdATtAogoqwXcdx1PqqFo',
    },
    isLoggedIn: true,
    bookmarks: {
      BTC: [
        {
          id: 0,
          address: 'mkakDp2f31btaXdATtAogoqwXcdx1PqqFo',
          title: 'saved account',
          amount: '0.001',
          type: 0,
        },
      ],
      LSK: [],
    },
    settings: {
      token: {
        active: 'BTC',
      },
    },
    transactions: [
      {
        id: 0,
        recipientId: 'mkakDp2f31btaXdATtAogoqwXcdx1PqqFo',
        amount: '0.001',
        token: 'BTC',
        type: 0,
      },
      {
        id: 1,
        recipientId: 'mkakDp2f31b3eXdATtAggoqwXcdx1PqqFo',
        amount: '0.0003',
        token: 'BTC',
        type: 0,
      },
    ],
  };

  beforeEach(() => {
    wrapper = mount(<Router><RecentTransactions {...lskProps} /></Router>);
  });

  it('Should render Recent Transactions properly with LSK active token', () => {
    expect(wrapper).toContainMatchingElement('TransactionList');
    expect(wrapper).toContainMatchingElement('TransactionTypeFigure');
    expect(wrapper).toContainMatchingElement('TransactionAddress');
    expect(wrapper).toContainMatchingElement('TransactionAmount');
    expect(wrapper).toContainMatchingElements(1, 'AccountVisual');
    expect(wrapper).toContainMatchingElements(4, 'img');
    expect(wrapper).not.toContainMatchingElement('EmptyState');
  });

  it('Should render Recent Transactions properly with BTC active token', () => {
    wrapper.setProps({
      children: React.cloneElement(wrapper.props().children, {
        ...btcProps,
      }),
    });

    wrapper.update();
    expect(wrapper).toContainMatchingElement('TransactionList');
    expect(wrapper).not.toContainMatchingElement('TransactionTypeFigure');
    expect(wrapper).toContainMatchingElement('TransactionAddress');
    expect(wrapper).toContainMatchingElement('TransactionAmount');
    expect(wrapper).not.toContainMatchingElement('AccountVisual');
    expect(wrapper).not.toContainMatchingElement('img');
    expect(wrapper).not.toContainMatchingElement('EmptyState');
  });

  it('Should render Recent Transactions with empty state', () => {
    wrapper.setProps({
      children: React.cloneElement(wrapper.props().children, {
        settings: {
          token: {
            active: 'BTC',
          },
        },
        transactions: [],
      }),
    });
    wrapper.update();
    expect(wrapper).not.toContainMatchingElement('TransactionList');
    expect(wrapper).toContainMatchingElement('EmptyState');
  });

  it('Should loadTransactions if mounted with props.transactions empty', () => {
    wrapper = mount(<Router><RecentTransactions {...lskProps} transactions={[]} /></Router>);
    expect(lskProps.loadTransactions).toHaveBeenCalledWith(expect.objectContaining({
      address: lskProps.account.address,
    }));
  });
});
