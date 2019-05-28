import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { SecondaryButtonV2 } from '../../toolbox/buttons/button';
import localJSONStorage from '../../../utils/localJSONStorage';
import txFilters from '../../../constants/transactionFilters';
import Banner from '../../toolbox/banner/banner';
import TransactionsOverviewHeader from '../transactionsOverviewHeader/transactionsOverviewHeader';
import routes from '../../../constants/routes';
import styles from './walletTransactionsV2.css';
import TabsContainer from '../../toolbox/tabsContainer/tabsContainer';
import WalletTab from '../../wallet/walletTab';
import DelegateTab from '../../delegate/delegateTab';
import VotesTab from '../../votes/votesTab';

class WalletTransactionsV2 extends React.Component {
  // eslint-disable-next-line max-statements
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
      copied: false,
      closedOnboarding: false,
    };

    this.copyTimeout = null;

    this.saveFilters = this.saveFilters.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
    this.clearAllFilters = this.clearAllFilters.bind(this);
    this.onInit = this.onInit.bind(this);
    this.onLoadMore = this.onLoadMore.bind(this);
    this.onFilterSet = this.onFilterSet.bind(this);
    this.onTransactionRowClick = this.onTransactionRowClick.bind(this);
    this.onCopy = this.onCopy.bind(this);
    this.closeOnboarding = this.closeOnboarding.bind(this);
    this.updateCustomFilters = this.updateCustomFilters.bind(this);
  }

  /* istanbul ignore next */
  componentWillUnmount() {
    clearTimeout(this.copyTimeout);
  }

  componentDidMount() {
    if (this.props.account.isDelegate) {
      this.props.updateAccountDelegateStats(this.props.account);
    }
    this.props.searchAccount({
      address: this.props.account.address,
    });
  }

  onInit() {
    this.props.loadLastTransaction(this.props.account.address);

    this.props.loadTransactions({
      address: this.props.account.address,
      filters: {
        direction: txFilters.all,
      },
    });

    this.props.addFilter({
      filterName: 'wallet',
      value: txFilters.all,
    });
  }
  /* istanbul ignore next */
  onLoadMore() {
    this.props.loadTransactions({
      address: this.props.address,
      offset: this.props.transactions.length,
      filters: {
        direction: this.props.activeFilter,
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
    if (filter <= 2) {
      this.props.loadTransactions({
        address: this.props.address,
        filters: {
          direction: filter,
          ...this.state.customFilters,
        },
      });
    } else {
      this.props.addFilter({
        filterName: 'wallet',
        value: filter,
        customFilters: this.state.activeCustomFilters,
      });
    }
  }

  onTransactionRowClick(props) {
    const transactionPath = `${routes.transactions.pathPrefix}${routes.transactions.path}/${props.value.id}`;
    this.props.history.push(transactionPath);
  }

  /* istanbul ignore next */
  saveFilters(customFilters) {
    this.props.loadTransactions({
      address: this.props.address,
      filters: {
        direction: this.props.activeFilter,
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

  onCopy() {
    clearTimeout(this.copyTimeout);
    this.setState({
      copied: true,
    });

    this.copyTimeout = setTimeout(() =>
      this.setState({
        copied: false,
      }), 3000);
  }

  closeOnboarding() {
    localJSONStorage.set('closedWalletOnboarding', 'true');
    this.setState({ closedOnboarding: true });
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
    };

    const { t, account } = this.props;

    const delegate = account.isDelegate
      ? { account, ...account.delegate }
      : {};

    return (
      <React.Fragment>
        <TransactionsOverviewHeader
          bookmarks={this.props.bookmarks}
          address={this.props.address}
          match={this.props.match}
          account={account}
        />
        { account.balance === 0 && localJSONStorage.get('closedWalletOnboarding') !== 'true' ?
          <Banner
            className={`${styles.onboarding} wallet-onboarding`}
            onClose={this.closeOnboarding}
            title={t('Add some LSK to your Lisk Hub account now!')}
            footer={(
              <div className={styles.copyAddress}>
                <span className={styles.address}>{account.address}</span>
                <CopyToClipboard
                  text={account.address}
                  onCopy={this.onCopy}>
                    <SecondaryButtonV2 className={'light'} disabled={this.state.copied}>
                      <span>{this.state.copied ? t('Copied') : t('Copy')}</span>
                    </SecondaryButtonV2>
                </CopyToClipboard>
              </div>
            )}>
            <p>{t('You can find the LSK token on all of the worlds top exchanges and send them to your unique Lisk address:')}</p>
          </Banner> : null
        }

        <TabsContainer>
          <WalletTab tabName={t('Wallet')}
            {...overviewProps}/>
          <VotesTab
            history={this.props.history}
            address={this.props.account.address}
            fetchVotedDelegateInfo={this.props.fetchVotedDelegateInfo}
            loading={this.props.loading}
            votes={this.props.votes}
            tabName={this.props.t('Votes')} />
          {account.isDelegate && delegate.txDelegateRegister
            ? (<DelegateTab
              tabClassName={'delegate-statistics'}
              tabName={t('Delegate')}
              delegate={delegate} />)
            : null}
        </TabsContainer>
      </React.Fragment>
    );
  }
}

export default WalletTransactionsV2;
