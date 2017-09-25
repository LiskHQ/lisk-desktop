import React from 'react';
import { translate } from 'react-i18next';
import { TooltipWrapper } from '../timestamp';
import styles from './transactions.css';
import ClickToSend from '../clickToSend';

const TransactionType = (props) => {
  const t = props.t;
  let type;
  switch (props.type) {
    case 1:
      type = 'Second Signature Creation';
      break;
    case 2:
      type = 'Delegate Registration';
      break;
    case 3:
      type = 'Vote';
      break;
    case 4:
      type = 'Multisignature Creation';
      break;
    case 5:
      type = 'Blockchain Application Registration';
      break;
    case 6:
      type = 'Send Lisk to Blockchain Application';
      break;
    case 7:
      type = 'Send Lisk from Blockchain Application';
      break;
    default:
      type = false;
      break;
  }
  const address = props.address !== props.senderId ? props.senderId : props.recipientId;
  const template = type ?
    <span className={styles.smallButton}>{t(type)}</span> :
    <ClickToSend recipient={address} className={`from-to ${styles.ordinaryText}`} >
      <TooltipWrapper tooltip={t('Send to this address')}>{address}</TooltipWrapper>
    </ClickToSend>;
  return template;
};

export default translate()(TransactionType);
