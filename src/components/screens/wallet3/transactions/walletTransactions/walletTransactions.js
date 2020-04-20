import React from 'react';
import txFilters from '../../../../../constants/transactionFilters';
import TransactionsOverviewHeader from '../transactionsOverviewHeader/transactionsOverviewHeader';
import routes from '../../../../../constants/routes';
import TabsContainer from '../../../../toolbox/tabsContainer/tabsContainer';
import WalletTab from '../../walletTab';
import DelegateTab from '../../../../shared/delegate';
import VotesTab from '../../../../shared/votes';
import WalletOnboarding from './walletOnboarding';
import analytics from '../../../../../utils/analytics';

class WalletTransactions extends React.Component {
  constructor() {
    super();

    this.state = {
      filter: {},
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

  componentDidMount() {
    const { settings, settingsUpdated } = this.props;
    analytics.onTriggerPageLoaded({ settings, settingsUpdated });
  }

  onInit() {
    this.props.getTransactions({
      address: this.props.account.address,
      filters: {
        direction: txFilters.all,
      },
    });
  }

  /* istanbul ignore next */
  onLoadMore() {
    const { filters } = this.props;
    this.props.getTransactions({
      address: this.props.account.address,
      offset: this.props.transactions.length,
      filters: {
        direction: filters.direction,
        ...this.state.customFilters,
      },
    });
  }

  /*
    Transactions from tabs are filtered based on filter number
    It applys to All, Incoming and Outgoing
    for other tabs that are not using transactions there is no need to call API
  */
  /* istanbul ignore next */
  onFilterSet(filter) {
    this.setState({ filter });
    this.props.getTransactions({
      address: this.props.address,
      filters: {
        direction: filter,
        ...this.state.customFilters,
      },
    });
  }

  onTransactionRowClick(props) {
    const transactionPath = `${routes.transactions.pathPrefix}${routes.transactions.path}/${props.value.id}`;
    this.props.history.push(transactionPath);
  }

  /* istanbul ignore next */
  saveFilters(customFilters) {
    const { filters } = this.props;
    this.props.getTransactions({
      address: this.props.address,
      filters: {
        direction: filters.direction,
        ...customFilters,
      },
    });
    this.setState({ activeCustomFilters: customFilters, customFilters });
  }

  /* istanbul ignore next */
  clearFilter(filterName) {
    this.saveFilters({
      ...this.state.customFilters,
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
      activeCustomFilters: this.state.activeCustomFilters,
      customFilters: this.state.customFilters,
      canLoadMore: this.props.transactions.length < this.props.count,
      onInit: this.onInit,
      onLoadMore: this.onLoadMore,
      onFilterSet: this.onFilterSet,
      onTransactionRowClick: this.onTransactionRowClick,
      saveFilters: this.saveFilters,
      clearFilter: this.clearFilter,
      clearAllFilters: this.clearAllFilters,
      changeFilters: this.changeFilters,
      detailAccount: this.props.account,
      updateCustomFilters: this.updateCustomFilters,
      activeToken: this.props.activeToken,
      activeFilter: this.props.filters.direction,
    };

    const {
      t, account, activeToken, isDiscreetMode,
    } = this.props;

    return (
      <React.Fragment>
        <WalletOnboarding t={t} />
        <TransactionsOverviewHeader
          bookmarks={this.props.bookmarks}
          address={this.props.address}
          match={this.props.match}
          account={account}
          activeToken={activeToken}
        />
        <TabsContainer>
          <WalletTab
            tabName={t('Wallet')}
            {...overviewProps}
            isDiscreetMode={isDiscreetMode}
          />
          {this.props.activeToken !== 'BTC' ? (
            <VotesTab
              history={this.props.history}
              address={this.props.account.address}
              tabName={this.props.t('Votes')}
            />
          ) : null}
          {account.delegate
            ? (
              <DelegateTab
                tabClassName="delegate-statistics"
                tabName={t('Delegate')}
                account={account}
              />
            )
            : null}
        </TabsContainer>
      </React.Fragment>
    );
  }
}

export default WalletTransactions;
