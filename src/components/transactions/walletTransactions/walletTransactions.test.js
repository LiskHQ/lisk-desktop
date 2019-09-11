import React from 'react';
import thunk from 'redux-thunk';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import configureMockStore from 'redux-mock-store';
import { MemoryRouter as Router } from 'react-router-dom';
import WalletTransactions from './walletTransactions';
import i18n from '../../../i18n';
import accounts from '../../../../test/constants/accounts';
import routes from '../../../constants/routes';
import networks from '../../../constants/networks';

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

  const store = configureMockStore([thunk])({
    account: accounts.genesis,
    bookmarks: {
      LSK: [],
      BTC: [],
    },
    network: {
      name: networks.mainnet.name,
      networks: {
        LSK: {},
      },
    },
    settings: {
      token: {
        active: 'LSK',
      },
    },
  });

  const options = {
    context: {
      store, i18n,
    },
    childContextTypes: {
      store: PropTypes.object.isRequired,
      i18n: PropTypes.object.isRequired,
    },
  };

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
    },
  };

  beforeEach(() => {
    wrapper = mount(<Router>
      <WalletTransactions {...props} />
    </Router>, options);
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
    wrapper = mount(<Router>
      <WalletTransactions {...{
        ...props,
        activeToken: 'BTC',
      }}
      />
    </Router>, options);
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
      wrapper = mount(<Router>
        <WalletTransactions {...delegateProps} />
      </Router>, options);
    });

    it('Should render delegate Tab', () => {
      expect(wrapper).toContainExactlyOneMatchingElement('TabsContainer');
      expect(wrapper.find('TabsContainer')).toContainMatchingElement('.delegateStats');
    });
  });
});
