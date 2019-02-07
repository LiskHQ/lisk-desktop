import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { SecondaryButtonV2 } from '../../toolbox/buttons/button';
import localJSONStorage from '../../../utils/localJSONStorage';
import TransactionsOverviewV2 from '../transactionsOverviewV2';
import txFilters from '../../../constants/transactionFilters';
import Banner from '../../toolbox/banner/banner';
import WalletHeader from './walletHeader';
import routes from '../../../constants/routes';
import styles from './walletTransactionsV2.css';

class WalletTransactionsV2 extends React.Component {
  constructor() {
    super();

    this.state = {
      copied: false,
      closedOnboarding: false,
    };
    this.copyTimeout = null;

    this.onInit = this.onInit.bind(this);
    this.onLoadMore = this.onLoadMore.bind(this);
    this.onFilterSet = this.onFilterSet.bind(this);
    this.onTransactionRowClick = this.onTransactionRowClick.bind(this);
    this.onCopy = this.onCopy.bind(this);
    this.closeOnboarding = this.closeOnboarding.bind(this);
  }

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
    });
  }
  /*
    Transactions from tabs are filtered based on filter number
    It applys to All, Incoming and Outgoing
    for other tabs that are not using transactions there is no need to call API
  */
  /* istanbul ignore next */
  onFilterSet(filter) {
    if (filter <= 2) {
      this.props.transactionsFilterSet({
        address: this.props.address,
        limit: 30,
        filter,
      });
    } else {
      this.props.addFilter({
        filterName: 'wallet',
        value: filter,
      });
    }
  }

  onTransactionRowClick(props) {
    const transactionPath = `${routes.transactions.pathPrefix}${routes.transactions.path}/${props.value.id}`;
    this.props.history.push(transactionPath);
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
      canLoadMore: this.props.transactions.length < this.props.count,
      onInit: this.onInit,
      onLoadMore: this.onLoadMore,
      onFilterSet: this.onFilterSet,
      onTransactionRowClick: this.onTransactionRowClick,
    };

    const { t, account } = this.props;

    return (
      <React.Fragment>
        <WalletHeader {...this.props} />
        { account.balance === 0 && localJSONStorage.get('closedWalletOnboarding') !== 'true' ?
          <Banner
            className={`${styles.onboarding} wallet-onboarding`}
            onClose={this.closeOnboarding}
            title={t('It’s time to get some LSK to your Hub Account!')}
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
            <p>{t('You can get LSK tokens on any supported exchanges and send them to your unique Lisk Address:')}</p>
          </Banner> : null
        }
        <TransactionsOverviewV2 {...overviewProps} />
      </React.Fragment>
    );
  }
}

export default WalletTransactionsV2;
