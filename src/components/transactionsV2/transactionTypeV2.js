import React from 'react';
import { translate } from 'react-i18next';
import AccountVisual from '../accountVisual';
import styles from './transactionTypeV2.css';
import { getIndexOfFollowedAccount } from '../../utils/followedAccounts';
import txIncoming from '../../assets/images/icons-v2/tx-incoming.svg';
import txOutgoing from '../../assets/images/icons-v2/tx-outgoing.svg';
import txDelegate from '../../assets/images/icons-v2/tx-delegate.svg';
import txVote from '../../assets/images/icons-v2/tx-vote.svg';

const TransactionTypeV2 = (props) => { // eslint-disable-line complexity
  const { t } = props;
  const address = props.address !== props.senderId ? props.senderId : props.recipientId;
  let type;
  let icon = (props.address === props.recipientId
    && props.address !== props.senderId) ? txIncoming : txOutgoing;
  switch (props.type) {
    case 1:
      type = t('Second passphrase registration');
      break;
    case 2:
      type = t('Delegate registration');
      icon = txDelegate;
      break;
    case 3:
      type = t('Delegate vote', { context: 'noun' });
      icon = txVote;
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

  const index = getIndexOfFollowedAccount(
    props.followedAccounts,
    { address },
  );
  const accountTitle = props.followedAccounts[index]
    && props.followedAccounts[index].title;
  const hasTitle = index !== -1 && accountTitle !== props.address;

  return (
    <div className={`${styles.transactionType} transaction-address`}>
      <img src={icon} className={styles.icon} />
      <div className={styles.info}>
      { type || props.showTransaction
        ? (
          <span className={styles.title}>{type || t('Transaction')}</span>
        ) : (
          <React.Fragment>
            <AccountVisual
              className={styles.avatar}
              address={address}
              size={36} />
            <div className={styles.accountInfo}>
              <span className={`${styles.title}`}>{
                hasTitle ? accountTitle : address
              }</span>
              { hasTitle && <span>{address}</span> }
            </div>
          </React.Fragment>
          )}
      </div>
    </div>
  );
};

export default translate()(TransactionTypeV2);
