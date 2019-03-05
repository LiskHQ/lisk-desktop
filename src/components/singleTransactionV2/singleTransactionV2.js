import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { translate } from 'react-i18next';
import { DateTimeFromTimestamp } from '../timestamp';
import LiskAmount from '../liskAmount';
import EmptyState from '../emptyState';
import svg from '../../utils/svgIcons';
import BoxV2 from '../boxV2';
import TransactionDetailViewV2 from '../transactionsV2/transactionDetailViewV2/transactionDetailViewV2';
import styles from './singleTransactionV2.css';

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

  // istanbul skip next
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

  // eslint-disable-next-line complexity
  render() {
    const { t, transaction } = this.props;
    let title = t('Transfer Transaction');
    let icon = svg.txDefault;
    switch (transaction.type) {
      case 1:
        title = t('2nd Passphrase Registration');
        icon = svg.tx2ndPassphrase;
        break;
      case 2:
        title = t('Delegate Registration');
        icon = svg.txDelegate;
        break;
      case 3:
        title = t('Vote Transaction');
        icon = svg.txVote;
        break;
      default:
        break;
    }

    return (
      <div className={`${grid.row} ${grid['center-xs']}`}>
      { this.props.transaction.id && !this.props.transaction.error ? (
        <BoxV2 className={`${grid['col-sm-7']} ${styles.wrapper}`}>
          <header className={`${styles.detailsHeader} tx-header`}>
            <h1>{title}</h1>
            <img className={styles.txIcon} src={icon} />
            <span className={`${styles.date} tx-date`}>
              <DateTimeFromTimestamp
                fulltime={true}
                className={'date'}
                time={transaction.timestamp}
                showSeconds={true} />
            </span>
          </header>
          <main className={styles.mainContent}>
            <TransactionDetailViewV2 address={this.props.address} transaction={transaction} />
            <footer className={styles.detailsFooter}>
              <div>
                <p className={styles.value}>
                  <span className={styles.label}>{t('Fee')} </span>
                  <span className={'tx-fee'}>
                    <LiskAmount val={transaction.fee} /> {t('LSK')}
                  </span>
                </p>
                <p className={`${styles.value} tx-id`}>
                  <span className={styles.label}>{t('Transaction ID')} </span>
                  <CopyToClipboard
                    className={`${styles.clickable} ${this.state.idCopied ? styles.copied : ''} transaction-id`}
                    text={transaction.id}
                    onCopy={() => this.handleCopy('id')}>
                    <span>
                    {this.state.idCopied
                      ? t('Copied!')
                      : <React.Fragment><span className={'copy-title'}>{transaction.id}</span> <img src={svg.copy}/></React.Fragment>}
                    </span>
                  </CopyToClipboard>
                </p>
              </div>
              <div>
                <p className={`${styles.value}`}>
                  <span className={styles.label}>{t('Confirmation')} </span>
                  <span className={'tx-confirmation'}>
                    {transaction.confirmations || 0}
                  </span>
                </p>
                <p className={`${styles.value} ${styles.link} ${this.state.linkCopied ? styles.copied : ''}`}>
                  <CopyToClipboard
                    className={'tx-link'}
                    text={`lisk:/${this.props.match.url}`}
                    onCopy={() => this.handleCopy('link')}>
                    {this.state.linkCopied
                      ? <span>{t('Copied!')}</span>
                      : <span>{t('Copy transaction link')} <img src={svg.icoLink} /></span>}
                  </CopyToClipboard>
                </p>
              </div>
            </footer>
          </main>
        </BoxV2>
      ) : (
        <BoxV2>
          <EmptyState title={this.props.t('No results')}
            message={this.props.t('Search for Lisk ID, Delegate or Transaction ID')} />
        </BoxV2>
      )}
      </div>
    );
  }
}

export default translate()(SingleTransactionV2);
