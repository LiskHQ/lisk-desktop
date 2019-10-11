import React from 'react';
import { mount } from 'enzyme';
import WalletTransactions from './walletTransactions';
import accounts from '../../../../../../test/constants/accounts';
import routes from '../../../../../constants/routes';

describe('WalletTransactions Component', () => {
  let wrapper;

  const transactions = [{
    id: '11327666066806006572',
    type: 0,
    timestamp: 15647029,
    senderId: '5201600508578320196L',
    recipientId: accounts.genesis.address,
    amount: 69550000000,
    fee: 10000000,
    confirmations: 4314504,
    address: '12345678L',
    asset: {},
    token: 'LSK',
  }];

  const props = {
    address: accounts.genesis.address,
    account: accounts.genesis,
    match: { params: { address: accounts.genesis.address } },
    history: { push: jest.fn(), location: { search: ' ' } },
    bookmarks: {
      LSK: [],
      BTC: [],
    },
    transactionsCount: 1000,
    transaction: transactions[0],
    transactions,
    getTransactions: jest.fn(),
    loading: [],
    wallets: {},
    t: key => key,
    hideChart: true, // Props to hide chart on tests, due to no canvas support
    activeToken: 'LSK',
    filters: {},
    settingsUpdated: jest.fn(),
    settings: {
      statisticsRequest: false,
      statisticsFollowingDay: 100,
      statistics: false,
    },
  };

  beforeEach(() => {
    wrapper = mount(<WalletTransactions {...props} />);
  });

  it('renders WalletTransaction Component and loads account transactions', () => {
    const renderedWalletTransactions = wrapper.find(WalletTransactions);
    expect(renderedWalletTransactions).toExist();
    expect(wrapper).toContainExactlyOneMatchingElement('div.transactions-row');
    expect(wrapper).toContainExactlyOneMatchingElement('VotesTab');
  });

  it('click on row transaction', () => {
    const transactionPath = `${routes.transactions.pathPrefix}${routes.transactions.path}/${transactions[0].id}`;
    wrapper.find('.transactions-row').first().simulate('click');
    expect(props.history.push).toBeCalledWith(transactionPath);
  });

  it('does not show VotesTab if activeToken is BTC', () => {
    wrapper = mount(
      <WalletTransactions {...{
        ...props,
        activeToken: 'BTC',
      }}
      />,
    );
    const renderedWalletTransactions = wrapper.find(WalletTransactions);
    expect(renderedWalletTransactions).toExist();
    expect(wrapper).toContainMatchingElements(0, 'VotesTab');
  });

  describe('Delegate Account', () => {
    const delegateProps = {
      ...props,
      account: {
        ...accounts.delegate,
        isDelegate: true,
        delegate: {
          account: accounts.delegate,
          approval: 98.63,
          missedBlocks: 10,
          producedBlocks: 304,
          productivity: 96.82,
          rank: 1,
          rewards: '140500000000',
          username: accounts.delegate.username,
          vote: '9876965713168313',
          lastBlock: 0,
          txDelegateRegister: { timestamp: 0 },
        },
      },
    };

    beforeEach(() => {
      wrapper = mount(<WalletTransactions {...delegateProps} />);
    });

    it('Should render delegate Tab', () => {
      expect(wrapper).toContainExactlyOneMatchingElement('TabsContainer');
      expect(wrapper.find('TabsContainer')).toContainMatchingElement('.delegateStats');
    });
  });
});
