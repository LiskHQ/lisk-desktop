import React from 'react';
import { translate } from 'react-i18next';
import styles from './transactions.css';

const TransactionType = (props) => {
  const { t } = props;
  let type;
  switch (props.type) {
    case 0:
      type = props.senderId === props.recipientId ? t('Account initialization') : false;
      break;
    case 1:
      type = t('Second passphrase registration');
      break;
    case 2:
      type = t('Delegate registration');
      break;
    case 3:
      type = t('Delegate vote', { context: 'noun' });
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
  const address = props.address !== props.senderId ? props.senderId : props.recipientId;
  const template = type || props.showTransaction ?
    <span className={styles.smallButton}>{type || t('Transaction')}</span> :
    <span className={styles.ordinaryText}>{address}</span>;
  return template;
};

export default translate()(TransactionType);
