import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { SecondaryButtonV2 } from '../../toolbox/buttons/button';
import localJSONStorage from '../../../utils/localJSONStorage';
import TransactionsOverviewV2 from '../transactionsOverviewV2';
import txFilters from '../../../constants/transactionFilters';
import Banner from '../../toolbox/banner/banner';
import TransactionsOverviewHeader from '../transactionsOverviewHeader/transactionsOverviewHeader';
import routes from '../../../constants/routes';
import styles from './walletTransactionsV2.css';

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
      activeFilter: {},
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

  onInit() {
    this.props.transactionsFilterSet({
      address: this.props.account.address,
      limit: 30,
      filter: txFilters.all,
    });

    this.props.addFilter({
      filterName: 'wallet',
      value: txFilters.all,
    });
  }
  /* istanbul ignore next */
  onLoadMore() {
    this.props.transactionsRequested({
      address: this.props.address,
      limit: 30,
      offset: this.props.transactions.length,
      filter: this.props.activeFilter,
      customFilters: this.state.activeFilter,
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
      this.props.transactionsFilterSet({
        address: this.props.address,
        limit: 30,
        filter,
        customFilters: this.state.activeFilter,
      });
    } else {
      this.props.addFilter({
        filterName: 'wallet',
        value: filter,
        customFilters: this.state.activeFilter,
      });
    }
  }

  onTransactionRowClick(props) {
    const transactionPath = `${routes.transactions.pathPrefix}${routes.transactions.path}/${props.value.id}`;
    this.props.history.push(transactionPath);
  }

  /* istanbul ignore next */
  saveFilters(customFilters) {
    this.props.transactionsFilterSet({
      address: this.props.address,
      limit: 30,
      filter: this.props.activeFilter,
      customFilters,
    });
    this.setState({ activeFilter: customFilters, customFilters });
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
      activeFilter: this.state.activeFilter,
      customFilters: this.state.customFilters,
      canLoadMore: this.props.transactions.length < this.props.count,
      onInit: this.onInit,
      onLoadMore: this.onLoadMore,
      onFilterSet: this.onFilterSet,
      onTransactionRowClick: this.onTransactionRowClick,
      saveFilters: this.saveFilters,
      clearFilter: this.clearFilter,
      clearAllFilters: this.clearAllFilters,
      updateCustomFilters: this.updateCustomFilters,
    };

    const { t, account } = this.props;

    return (
      <React.Fragment>
        <TransactionsOverviewHeader
          followedAccounts={this.props.followedAccounts}
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
                    <SecondaryButtonV2 disabled={this.state.copied}>
                      <span>{this.state.copied ? t('Copied') : t('Copy')}</span>
                    </SecondaryButtonV2>
                </CopyToClipboard>
              </div>
            )}>
            <p>{t('You can find the LSK token on all of the worlds top exchanges and send them to your unique Lisk address:')}</p>
          </Banner> : null
        }
        <TransactionsOverviewV2 {...overviewProps} />
      </React.Fragment>
    );
  }
}

export default WalletTransactionsV2;
