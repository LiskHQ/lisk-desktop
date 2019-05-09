import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { translate } from 'react-i18next';
import { DateTimeFromTimestamp } from '../timestamp';
import LiskAmount from '../liskAmount';
import EmptyState from '../emptyState';
import svg from '../../utils/svgIcons';
import BoxV2 from '../boxV2';
import { SecondaryButtonV2 } from '../toolbox/buttons/button';
import TransactionDetailViewV2 from '../transactionsV2/transactionDetailViewV2/transactionDetailViewV2';
import styles from './singleTransactionV2.css';
import transactionTypes from '../../constants/transactionTypes';

class SingleTransactionV2 extends React.Component {
  constructor(props) {
    super();

    this.state = {
      idCopied: false,
      linkCopied: false,
    };

    if (props.peers.liskAPIClient) {
      props.loadTransaction({
        id: props.match.params.id,
      });
    }

    this.handleCopy = this.handleCopy.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.peers.liskAPIClient !== this.props.peers.liskAPIClient
      || nextProps.match.params.id !== this.props.match.params.id) {
      this.props.loadTransaction({
        id: nextProps.match.params.id,
      });
      return false;
    }
    return true;
  }

  // istanbul ignore next
  componentWillUnmount() {
    clearTimeout(this.idTimeout);
    clearTimeout(this.linkTimeout);
  }

  handleCopy(name) {
    clearTimeout(this[`${name}Timeout`]);
    this[`${name}Timeout`] = setTimeout(() => {
      this.setState({ [`${name}Copied`]: false });
    }, 3000);
    this.setState({ [`${name}Copied`]: true });
  }

  getLinkToCopy() {
    return {
      LSK: `lisk:/${this.props.match.url}`,
      BTC: this.props.transaction.explorerLink,
    }[this.props.transaction.token];
  }

  // eslint-disable-next-line complexity
  render() {
    const { t, transaction } = this.props;
    let title = t('Transfer Transaction');
    switch (transaction.type) {
      case transactionTypes.setSecondPassphrase:
        title = t('2nd Passphrase Registration');
        break;
      case transactionTypes.registerDelegate:
        title = t('Delegate Registration');
        break;
      case transactionTypes.vote:
        title = t('Vote Transaction');
        break;
      default:
        break;
    }


    return (
      <div className={`${grid.row} ${grid['center-xs']}`}>
      { transaction.id && !transaction.error ? (
        <BoxV2 className={`${grid['col-sm-8']} ${grid['col-md-4']} ${styles.wrapper}`}>
          <header className={`${styles.detailsHeader} tx-header`}>
            <h1>{title}</h1>
              <CopyToClipboard
                text={this.getLinkToCopy()}
                onCopy={() => this.handleCopy('link')}>
                <SecondaryButtonV2 className={'extra-small'} disabled={this.state.linkCopied}>
                  {this.state.linkCopied
                    ? <span className={`${styles.txLink} tx-link`}>{t('Copied!')}</span>
                    : (<span className={`${styles.txLink} tx-link`}>
                        {t('Copy link')}
                        <img className={'button-icon'} src={svg.icoLink} />
                      </span>)
                  }
                </SecondaryButtonV2>
              </CopyToClipboard>
          </header>
          <main className={styles.mainContent}>
            <TransactionDetailViewV2 address={this.props.address} transaction={transaction} />
            <footer className={styles.detailsFooter}>
              <div>
                <p className={styles.value}>
                  <span className={styles.label}>{t('Date')}</span>
                  <span className={`${styles.date} tx-date`}>
                    <DateTimeFromTimestamp
                      fulltime={true}
                      className={'date'}
                      time={transaction.timestamp}
                      token={transaction.token}
                      showSeconds={true} />
                  </span>
                </p>
                <p className={styles.value}>
                  <span className={styles.label}>{t('Transaction fee')} </span>
                  <span className={'tx-fee'}>
                    <LiskAmount val={transaction.fee} /> {t('LSK')}
                  </span>
                </p>
              </div>
              <div>
                <p className={`${styles.value}`}>
                  <span className={styles.label}>{t('Confirmations')} </span>
                  <span className={'tx-confirmation'}>
                    {transaction.confirmations || 0}
                  </span>
                </p>
              </div>
              <div>
              <CopyToClipboard
                className={`${styles.clickable} ${styles.value} tx-id`}
                text={transaction.id}
                onCopy={() => this.handleCopy('id')}>
                  <p>
                    <span className={styles.label}>
                      {t('Transaction ID')}
                      <img src={svg.icoLink} />
                    </span>
                    <span className={'transaction-id'}>
                      {this.state.idCopied
                        ? t('Copied!')
                        : <span className={'copy-title'}>{transaction.id}</span>
                      }
                    </span>
                  </p>
                </CopyToClipboard>
              </div>
            </footer>
          </main>
        </BoxV2>
      ) : typeof transaction === 'string' && (
        <BoxV2 className={`${grid['col-sm-8']} ${grid['col-md-4']}`}>
          <EmptyState title={this.props.t('No results')}
            message={this.props.t('Search for Lisk ID, Delegate or Transaction ID')} />
        </BoxV2>
      )}
      </div>
    );
  }
}

export default translate()(SingleTransactionV2);
