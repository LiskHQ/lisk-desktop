import React from 'react';
import { translate } from 'react-i18next';
import AccountVisual from '../accountVisual';
import styles from './transactionTypeV2.css';
import { getIndexOfBookmark } from '../../utils/bookmarks';
import svg from '../../utils/svgIcons';
import { getTokenFromAddress } from '../../utils/api/transactions';

const TransactionTypeV2 = (props) => { // eslint-disable-line complexity
  const { t } = props;
  const address = props.address !== props.senderId ? props.senderId : props.recipientId;
  let type;
  let icon = svg.txDefault;
  switch (props.type) {
    case 1:
      type = t('Second passphrase registration');
      icon = svg.tx2ndPassphrase;
      break;
    case 2:
      type = t('Delegate registration');
      icon = svg.txDelegate;
      break;
    case 3:
      type = t('Delegate vote', { context: 'noun' });
      icon = svg.txVote;
      break;
    case 4:
      type = t('Multisignature Creation');
      break;
    case 5:
      type = t('Blockchain Application Registration');
      break;
    case 6:
      type = t('Send Lisk to Blockchain Application');
      break;
    case 7:
      type = t('Send Lisk from Blockchain Application');
      break;
    default:
      type = false;
      break;
  }
  const token = getTokenFromAddress(address);

  const index = getIndexOfBookmark(
    props.bookmarks,
    { address, token },
  );
  const hasTitle = index > -1;
  const accountTitle = hasTitle && props.bookmarks[token][index]
    && props.bookmarks[token][index].title;

  return (
    <div className={`${styles.transactionType} transaction-address`}>
      <img src={icon} className={`${styles.icon} tx-icon`} />
      <div className={styles.info}>
      { type || props.showTransaction
        ? (
          <span className={styles.title}>{type || t('Transaction')}</span>
        ) : (
          <React.Fragment>
            <AccountVisual
              className={`${styles.avatar} tx-avatar`}
              address={address}
              size={36} />
            <div className={styles.accountInfo}>
              <span className={`${styles.title}`}>{
                hasTitle ? accountTitle : address
              }</span>
              { hasTitle && <span className={styles.address}>{address}</span> }
            </div>
          </React.Fragment>
          )}
      </div>
    </div>
  );
};

export default translate()(TransactionTypeV2);
