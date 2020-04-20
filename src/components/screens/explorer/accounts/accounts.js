import React from 'react';
import DelegateTab from '../../../shared/delegate';
import TabsContainer from '../../../toolbox/tabsContainer/tabsContainer';
import TransactionsOverviewHeader from '../../wallet3/transactions/transactionsOverviewHeader/transactionsOverviewHeader';
import VotesTab from '../../../shared/votes';
import WalletTab from '../../wallet3/walletTab';
import actionTypes from '../../../../constants/actions';
import routes from '../../../../constants/routes';

class Accounts extends React.Component {
  // eslint-disable-next-line max-statements
  constructor() {
    super();

    this.state = {
      customFilters: {
        dateFrom: '',
        dateTo: '',
        amountFrom: '',
        amountTo: '',
        message: '',
      },
      activeCustomFilters: {},
    };

    this.saveFilters = this.saveFilters.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
    this.clearAllFilters = this.clearAllFilters.bind(this);
    this.onInit = this.onInit.bind(this);
    this.onLoadMore = this.onLoadMore.bind(this);
    this.onFilterSet = this.onFilterSet.bind(this);
    this.onTransactionRowClick = this.onTransactionRowClick.bind(this);
    this.updateCustomFilters = this.updateCustomFilters.bind(this);
  }

  onInit() {
    this.props.transactions.loadData({
      filters: {
        ...this.state.activeCustomFilters,
        direction: this.props.transactions.urlSearchParams.filters.direction,
      },
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.activeToken !== prevProps.activeToken) {
      this.props.history.push(routes.dashboard.path);
    }
  }

  onLoadMore() {
    this.props.transactions.loadData({
      offset: this.props.transactions.data.data.length,
      filters: {
        ...this.state.activeCustomFilters,
        direction: this.props.transactions.urlSearchParams.filters.direction,
      },
    });
  }

  /*
    Transactions from tabs are filtered based on filter number
    It applys to All, Incoming and Outgoing
    for other tabs that are not using transactions there is no need to call API
  */
  onFilterSet(filter) {
    this.props.transactions.loadData({
      filters: {
        ...this.state.activeCustomFilters,
        direction: filter,
      },
    });
  }

  onTransactionRowClick(props) {
    const transactionPath = `${routes.transactions.pathPrefix}${routes.transactions.path}/${props.value.id}`;
    this.props.history.push(transactionPath);
  }

  /* istanbul ignore next */
  saveFilters(customFilters) {
    this.props.transactions.loadData({
      filters: {
        ...customFilters,
        direction: this.props.transactions.urlSearchParams.filters.direction,
      },
    });
    this.setState({ activeCustomFilters: customFilters, customFilters });
  }

  /* istanbul ignore next */
  clearFilter(filterName) {
    this.saveFilters({
      ...this.state.activeCustomFilters,
      [filterName]: '',
    });
  }

  /* istanbul ignore next */
  clearAllFilters() {
    const customFilters = Object.keys(this.state.customFilters).reduce((acc, key) => ({ ...acc, [key]: '' }), {});
    this.saveFilters(customFilters);
  }

  /* istanbul ignore next */
  updateCustomFilters(customFilters) {
    this.setState({ customFilters });
  }

  render() {
    const overviewProps = {
      ...this.props,
      canLoadMore: this.props.transactions.data.data.length
        < this.props.transactions.data.meta.count,
      onInit: this.onInit,
      onLoadMore: this.onLoadMore,
      onFilterSet: this.onFilterSet,
      onTransactionRowClick: this.onTransactionRowClick,
      saveFilters: this.saveFilters,
      clearFilter: this.clearFilter,
      clearAllFilters: this.clearAllFilters,
      activeCustomFilters: this.state.activeCustomFilters,
      customFilters: this.state.customFilters,
      updateCustomFilters: this.updateCustomFilters,
      activeToken: this.props.activeToken,
      transactions: this.props.transactions.data.data,
      activeFilter: this.props.transactions.urlSearchParams.filters.direction,
      loading: this.props.transactions.isLoading ? [actionTypes.getTransactions] : [],
      balance: this.props.detailAccount.data.balance,
    };
    const { detailAccount, isDiscreetMode } = this.props;

    return (
      <React.Fragment>
        <TransactionsOverviewHeader
          delegate={detailAccount.data.delegate}
          bookmarks={this.props.bookmarks}
          address={this.props.address}
          match={this.props.match}
          t={this.props.t}
          account={this.props.account}
          activeToken={this.props.activeToken}
          detailAccount={detailAccount.data}
        />
        <TabsContainer>
          <WalletTab
            tabName={this.props.t('Wallet')}
            {...overviewProps}
            isDiscreetMode={isDiscreetMode}
          />
          {
            detailAccount.data.delegate
              ? (
                <DelegateTab
                  tabClassName="delegate-statistics"
                  tabName={this.props.t('Delegate')}
                  account={detailAccount.data}
                />
              )
              : null
          }
          {
            this.props.activeToken !== 'BTC'
              ? (
                <VotesTab
                  history={this.props.history}
                  address={this.props.address}
                  tabClassName="account-info"
                  tabName={this.props.t('Votes')}
                />
              )
              : null
          }
        </TabsContainer>
      </React.Fragment>
    );
  }
}

export default Accounts;
