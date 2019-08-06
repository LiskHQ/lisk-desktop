import { translate } from 'react-i18next';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { DateTimeFromTimestamp } from '../timestamp';
import { SecondaryButton } from '../toolbox/buttons/button';
import { tokenMap } from '../../constants/tokens';
import Box from '../box';
import CopyToClipboard from '../toolbox/copyToClipboard';
import LiskAmount from '../liskAmount';
import NotFound from '../notFound';
import Tooltip from '../toolbox/tooltip/tooltip';
import TransactionDetailView from './transactionDetailView/transactionDetailView';
import routes from '../../constants/routes';
import styles from './singleTransaction.css';
import transactionTypes from '../../constants/transactionTypes';

class SingleTransaction extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.activeToken !== prevProps.activeToken) {
      this.props.history.push(routes.dashboard.path);
    }
  }

  getLinkToCopy() {
    return {
      LSK: `lisk:/${this.props.match.url}`,
      BTC: this.props.transaction.data.explorerLink,
    }[this.props.activeToken];
  }

  render() {
    const { t, activeToken, address } = this.props;
    const transaction = this.props.transaction.data;

    return (
      <div className={`${grid.row} ${grid['center-xs']} ${styles.container}`}>
        { transaction.id && !transaction.error ? (
          <Box className={styles.wrapper}>
            <header className={`${styles.detailsHeader}`}>
              <h1>{t('Transaction details')}</h1>
              <CopyToClipboard
                value={this.getLinkToCopy()}
                text={t('Copy link')}
                Container={SecondaryButton}
                containerClassName="extra-small"
                copyClassName={styles.copyIcon}
              />
            </header>
            <main className={styles.mainContent}>
              <TransactionDetailView
                address={address}
                activeToken={activeToken}
                transaction={transaction}
              >
                <footer className={styles.detailsFooter}>
                  <div>
                    <div className={styles.value}>
                      <span className={styles.label}>{t('Date')}</span>
                      <span className={`${styles.date} tx-date`}>
                        <DateTimeFromTimestamp
                          fulltime
                          className="date"
                          time={transaction.timestamp}
                          token={activeToken}
                          showSeconds
                        />
                      </span>
                    </div>
                    <div className={`${styles.value}`}>
                      <span className={styles.label}>
                        {t('Confirmations')}
                        <Tooltip className="showOnTop">
                          <p>
                            { t('Confirmations refer to the number of blocks added to the {{token}} blockchain after a transaction has been submitted. The more confirmations registered, the more secure the transaction becomes.', { token: tokenMap[activeToken].label })}
                          </p>
                        </Tooltip>
                      </span>
                      <span className="tx-confirmation">
                        {transaction.confirmations || 0}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className={`${styles.value}`}>
                      <span className={styles.label}>
                        {t('Transaction ID')}
                      </span>
                      <span className="transaction-id">
                        <CopyToClipboard
                          value={transaction.id}
                          className="tx-id"
                          containerClassName="extra-small copy-title"
                          copyClassName={styles.copyIcon}
                        />
                      </span>
                    </div>
                  </div>
                  <div>
                    { transaction.type === transactionTypes.send
                      ? (
                        <div className={styles.value}>
                          <span className={styles.label}>
                            {t('Amount')}
                          </span>
                          <span className="tx-amount">
                            <LiskAmount val={transaction.amount} />
                            {' '}
                            {activeToken}
                          </span>
                        </div>
                      ) : null }
                    <div className={styles.value}>
                      <span className={styles.label}>
                        {t('Transaction fee')}
                      </span>
                      <span className="tx-fee">
                        <LiskAmount val={transaction.fee} />
                        {' '}
                        {activeToken}
                      </span>
                    </div>
                  </div>
                </footer>
              </TransactionDetailView>
            </main>
          </Box>
        ) : transaction.errors && transaction.errors.length && (
        <NotFound />
        )}
      </div>
    );
  }
}

export default translate()(SingleTransaction);
