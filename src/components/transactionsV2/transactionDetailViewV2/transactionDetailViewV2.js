import React from 'react';
import { translate } from 'react-i18next';
import AccountInfo from './accountInfo';
import TransactionVotes from './transactionVotes';
import styles from './transactionDetailViewV2.css';
import AmountV2 from '../amountV2';
import svg from '../../../utils/svgIcons';
import transactionTypes from '../../../constants/transactionTypes';

class TransactionDetailViewV2 extends React.Component {
  // eslint-disable-next-line complexity
  render() {
    const { transaction, t } = this.props;
    let label = t('Sender');
    let title = t('Amount transfered');
    let value = transaction.amount;
    switch (transaction.type) {
      case transactionTypes.setSecondPassphrase:
        label = t('Registrant');
        break;
      case transactionTypes.registerDelegate:
        label = t('Registrant');
        title = t('Username');
        value = transaction.asset
          && transaction.asset.delegate
          && transaction.asset.delegate.username;
        break;
      case transactionTypes.vote:
        label = t('Voter');
        break;
      default:
        break;
    }

    return (transaction.id ? (
      <React.Fragment>
        {transaction.type === transactionTypes.send ||
          transaction.type === transactionTypes.registerDelegate ? (
          <div className={styles.summaryHeader}>
            <p>
            {transaction.type === transactionTypes.send ? (
              <span className={'tx-amount'}>
                <AmountV2
                  className={styles.txAmount}
                  address={this.props.address}
                  value={transaction} />
              </span>
              ) : value
            }
            </p>
            <h1>{title}</h1>
          </div>
        ) : null}
        <div className={styles.accountWrapper}>
          <AccountInfo
            address={transaction.senderId}
            addressClass={'sender-address'}
            label={label} />
          {transaction.type === transactionTypes.send ? (
            <React.Fragment>
              <span className={styles.separator}><img src={svg.txSendArrow} /></span>
              <AccountInfo
                address={transaction.recipientId}
                addressClass={'receiver-address'}
                label={'Recipient'} />
            </React.Fragment>) : null
          }
        </div>
        { transaction.type === transactionTypes.send ||
          transaction.type === transactionTypes.vote ? (
          <React.Fragment>
          { transaction.type === transactionTypes.send &&
            (transaction.asset && transaction.asset.data) ? (
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
          </React.Fragment>) : null}
        </React.Fragment>
    ) : null);
  }
}

export default translate()(TransactionDetailViewV2);
