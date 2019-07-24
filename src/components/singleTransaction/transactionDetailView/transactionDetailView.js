import { translate } from 'react-i18next';
import React from 'react';
import AccountInfo from './accountInfo';
import TransactionTypeFigure from '../../transactions/typeFigure/TransactionTypeFigure';
import TransactionVotes from './transactionVotes';
import styles from './transactionDetailView.css';
import transactionTypes from '../../../constants/transactionTypes';


function getDelegateName(transaction) {
  return transaction.asset && transaction.asset.delegate && transaction.asset.delegate.username;
}

class TransactionDetailView extends React.Component {
  render() {
    const { transaction, t, children } = this.props;
    const { senderLabel, title } = {
      [transactionTypes.setSecondPassphrase]: {
        title: t('2nd passphrase registration'),
        senderLabel: t('Account'),
      },
      [transactionTypes.registerDelegate]: {
        title: t('Delegate registration'),
        senderLabel: t('Account nickname'),
      },
      [transactionTypes.vote]: {
        title: t('Delegate vote'),
        senderLabel: t('Voter'),
      },
    }[transaction.type] || {
      senderLabel: t('Sender'),
    };

    return (transaction.id ? (
      <React.Fragment>
        {title ? (
          <div className={styles.summaryHeader}>
            <TransactionTypeFigure
              address={transaction.senderId}
              transactionType={transaction.type}
            />
            <h2 className="tx-header">{title}</h2>
          </div>
        ) : null}
        <div className={styles.detailsWrapper}>
          <AccountInfo
            name={getDelegateName(transaction)}
            address={transaction.senderId}
            addressClass="sender-address"
            label={senderLabel}
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
        {children}
        { transaction.type === transactionTypes.send
          && (transaction.asset && transaction.asset.data) ? (
            <div className={styles.detailsWrapper}>
              <span className={styles.label}>{t('Message')}</span>
              <div className={`${styles.message} tx-reference`}>
                {transaction.asset.data}
              </div>
            </div>
          ) : null
        }
        { transaction.type === transactionTypes.vote && transaction.votesName ? (
          <TransactionVotes votes={transaction.votesName} />
        ) : null
        }
      </React.Fragment>
    ) : null);
  }
}

TransactionDetailView.defaultProps = {
  children: null,
};

export default translate()(TransactionDetailView);
