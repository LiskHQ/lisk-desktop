import React from 'react';
import { translate } from 'react-i18next';
import AccountInfo from './accountInfo';
import TransactionVotes from './transactionVotes';
import styles from './transactionDetailViewV2.css';
import AmountV2 from '../amountV2';
import transactionTypes from '../../../constants/transactionTypes';

class TransactionDetailViewV2 extends React.Component {
  // eslint-disable-next-line complexity
  render() {
    const { transaction, t, activeToken } = this.props;
    let label = t('Sender');
    let title;
    let value = transaction.amount;
    switch (transaction.type) {
      case transactionTypes.setSecondPassphrase:
        title = t('2nd passphrase pegistration');
        label = t('Account');
        break;
      case transactionTypes.registerDelegate:
        title = t('Delegate registration');
        label = t('Account');
        value = transaction.asset
          && transaction.asset.delegate
          && transaction.asset.delegate.username;
        break;
      case transactionTypes.vote:
        title = t('Delegate vote');
        label = t('Voter');
        break;
      default:
        break;
    }

    return (transaction.id ? (
      <React.Fragment>
        {title ? (
          <div className={styles.summaryHeader}>
            <h2>{title}</h2>
            <p>
              {transaction.type === transactionTypes.send ? (
                <span className="tx-amount">
                  <AmountV2
                    className={styles.txAmount}
                    token={activeToken}
                    value={transaction}
                  />
                </span>
              ) : value
            }
            </p>
          </div>
        ) : null}
        <div className={styles.detailsWrapper}>
          <AccountInfo
            address={transaction.senderId}
            addressClass="sender-address"
            label={label}
          />
        </div>
        {transaction.type === transactionTypes.send
          ? (
            <div className={styles.detailsWrapper}>
              <AccountInfo
                address={transaction.recipientId}
                addressClass="receiver-address"
                label="Recipient"
              />
            </div>
          )
          : null
          }
        { transaction.type === transactionTypes.send
          || transaction.type === transactionTypes.vote ? (
            <React.Fragment>
              { transaction.type === transactionTypes.send
            && (transaction.asset && transaction.asset.data) ? (
              <div className={styles.detailsWrapper}>
                <span className={styles.label}>{t('Message')}</span>
                <div className={`${styles.message} tx-reference`}>
                  {transaction.asset.data}
                </div>
              </div>
                ) : null}
              { transaction.type === transactionTypes.vote && transaction.votesName ? (
                <TransactionVotes votes={transaction.votesName} />
              ) : null}
            </React.Fragment>
          ) : null}
      </React.Fragment>
    ) : null);
  }
}

export default translate()(TransactionDetailViewV2);
