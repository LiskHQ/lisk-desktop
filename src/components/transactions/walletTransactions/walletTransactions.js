import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { SecondaryButton } from '../../toolbox/buttons/button';
import { tokenMap } from '../../../constants/tokens';
import localJSONStorage from '../../../utils/localJSONStorage';
import txFilters from '../../../constants/transactionFilters';
import Banner from '../../toolbox/banner/banner';
import TransactionsOverviewHeader from '../transactionsOverviewHeader/transactionsOverviewHeader';
import routes from '../../../constants/routes';
import styles from './walletTransactions.css';
import TabsContainer from '../../toolbox/tabsContainer/tabsContainer';
import WalletTab from '../../wallet/walletTab';
import DelegateTab from '../../delegate';
import VotesTab from '../../votes';

class WalletTransactions extends React.Component {
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
    if (this.props.account.delegate) {
      this.props.updateAccountDelegateStats(this.props.account);
    }
  }

  onInit() {
    this.props.getLastTransaction(this.props.account.address);

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
      activeToken: this.props.activeToken,
      activeFilter: this.props.filters.direction,
    };

    const { t, account, activeToken } = this.props;

    return (
      <React.Fragment>
        <TransactionsOverviewHeader
          bookmarks={this.props.bookmarks}
          address={this.props.address}
          match={this.props.match}
          account={account}
          activeToken={activeToken}
        />
        { account.balance === 0 && localJSONStorage.get('closedWalletOnboarding') !== 'true'
          ? (
            <Banner
              className={`${styles.onboarding} wallet-onboarding`}
              onClose={this.closeOnboarding}
              title={t('Add some {{activeToken}} to your Lisk Hub account now!', { activeToken })}
              footer={(
                <div className={styles.copyAddress}>
                  <span className={styles.address}>{account.address}</span>
                  <CopyToClipboard
                    text={account.address}
                    onCopy={this.onCopy}
                  >
                    <SecondaryButton className="light" disabled={this.state.copied}>
                      <span>{this.state.copied ? t('Copied') : t('Copy')}</span>
                    </SecondaryButton>
                  </CopyToClipboard>
                </div>
            )}
            >
              <p>{t('You can find the {{activeToken}} token on all of the worlds top exchanges and send them to your unique {{currency}} address:', { activeToken, currency: tokenMap[activeToken].label })}</p>
            </Banner>
          ) : null
        }

        <TabsContainer>
          <WalletTab
            tabName={t('Wallet')}
            {...overviewProps}
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
