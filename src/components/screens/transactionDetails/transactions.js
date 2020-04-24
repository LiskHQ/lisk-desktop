import { withTranslation } from 'react-i18next';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { DateTimeFromTimestamp } from '../../../toolbox/timestamp';
import { SecondaryButton } from '../../../toolbox/buttons/button';
import { tokenMap } from '../../../../constants/tokens';
import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import BoxContent from '../../../toolbox/box/content';
import BoxRow from '../../../toolbox/box/row';
import CopyToClipboard from '../../../toolbox/copyToClipboard';
import DiscreetMode from '../../../shared/discreetMode';
import LiskAmount from '../../../shared/liskAmount';
import NotFound from '../../../shared/notFound';
import Tooltip from '../../../toolbox/tooltip/tooltip';
import TransactionDetailView from './transactionDetailView/transactionDetailView';
import routes from '../../../../constants/routes';
import styles from './transactions.css';
import transactionTypes from '../../../../constants/transactionTypes';

function addVotesWithDelegateNames(transaction, delegates, t) {
  const getVotesStartingWith = sign => (
    transaction.asset.votes
      .filter(item => item.startsWith(sign))
      .map(item => item.replace(sign, ''))
  );

  const getDelegate = publicKey => (
    delegates[publicKey] || { username: t('Loading name...'), account: {} }
  );

  if (transaction.asset && transaction.asset.votes) {
    transaction.votesName = {
      added: getVotesStartingWith('+').map(getDelegate),
      deleted: getVotesStartingWith('-').map(getDelegate),
    };
  }
  return transaction;
}

class Transactions extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.activeToken !== prevProps.activeToken) {
      this.props.history.push(routes.dashboard.path);
    }
    if (prevProps.transaction.isLoading && !this.props.transaction.isLoading) {
      this.fetchDelegates();
    }
  }

  fetchDelegates() {
    const { transaction, delegates } = this.props;
    if (transaction.data.asset && transaction.data.asset.votes) {
      transaction.data.asset.votes
        .forEach(publicKey => delegates.loadData({ publicKey: publicKey.substring(1) }));
    }
  }

  getLinkToCopy() {
    return {
      LSK: `lisk:/${this.props.match.url}`,
      BTC: this.props.transaction.data.explorerLink,
    }[this.props.activeToken];
  }

  render() {
    const {
      t, activeToken, address, delegates, netCode,
    } = this.props;
    const transaction = addVotesWithDelegateNames(this.props.transaction.data, delegates.data, t);
    const { error, isLoading } = this.props.transaction;
    const addresses = transaction && [transaction.recipientId, transaction.senderId];

    return (
      <div className={`${grid.row} ${grid['center-xs']} ${styles.container}`}>
        { !error ? (
          <Box width="medium" isLoading={isLoading}>
            <BoxHeader>
              <h1>{t('Transaction details')}</h1>
              <CopyToClipboard
                value={this.getLinkToCopy()}
                text={t('Copy link')}
                Container={SecondaryButton}
                containerProps={{ size: 'xs' }}
                copyClassName={styles.copyIcon}
              />
            </BoxHeader>
            <BoxContent className={styles.mainContent}>
              <TransactionDetailView
                netCode={netCode}
                address={address}
                activeToken={activeToken}
                transaction={transaction}
              >
                <BoxRow>
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
                </BoxRow>
                <BoxRow>
                  <div className={`${styles.value}`}>
                    <span className={styles.label}>
                      {t('Transaction ID')}
                    </span>
                    <span className="transaction-id">
                      <CopyToClipboard
                        value={transaction.id}
                        className="tx-id"
                        containerProps={{
                          size: 'xs',
                          className: 'copy-title',
                        }}
                        copyClassName={styles.copyIcon}
                      />
                    </span>
                  </div>
                </BoxRow>
                <BoxRow>
                  { transaction.type === transactionTypes().send.code
                    ? (
                      <div className={styles.value}>
                        <span className={styles.label}>
                          {t('Amount')}
                        </span>
                        <DiscreetMode addresses={addresses} shouldEvaluateForOtherAccounts>
                          <span className="tx-amount">
                            <LiskAmount val={transaction.amount} />
                            {' '}
                            {activeToken}
                          </span>
                        </DiscreetMode>
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
                </BoxRow>
              </TransactionDetailView>
            </BoxContent>
          </Box>
        ) : (
          <NotFound />
        ) }
      </div>
    );
  }
}

export default withTranslation()(Transactions);
