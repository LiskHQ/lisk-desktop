import { translate } from 'react-i18next';
import React from 'react';
import AccountInfo from './accountInfo';
import TransactionTypeFigure from
  '../../transactions/typeFigure/TransactionTypeFigure';
import TransactionVotes from './transactionVotes';
import styles from './transactionDetailViewV2.css';
import transactionTypes from '../../../constants/transactionTypes';

class TransactionDetailViewV2 extends React.Component {
  // eslint-disable-next-line complexity
  render() {
    const { transaction, t } = this.props;
    let senderLabel = t('Sender');
    let title;
    switch (transaction.type) {
      case transactionTypes.setSecondPassphrase:
        title = t('2nd passphrase registration');
        senderLabel = t('Account');
        break;
      case transactionTypes.registerDelegate:
        title = t('Delegate registration');
        senderLabel = t('Account');
        break;
      case transactionTypes.vote:
        title = t('Delegate vote');
        senderLabel = t('Voter');
        break;
      default:
        break;
    }

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

export default translate()(TransactionDetailViewV2);
