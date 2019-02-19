import React from 'react';
import { translate } from 'react-i18next';
import styles from './transactionsV2.css';
import LiskAmount from '../liskAmount';
import transactionTypes from '../../constants/transactionTypes';

const AmountV2 = (props) => {
  const params = {
    pos: props.t('LSK'),
    pre: '',
    className: 'greyLabel',
  };
  if (props.value.senderId !== props.address) {
    params.className = 'greenLabel';
    params.pre = '+';
  } else if (props.value.type === transactionTypes.send &&
      props.value.recipientId !== props.address) {
    params.pre = '-';
  }
  const amount = props.value.type !== transactionTypes.send ? '-' : <LiskAmount val={props.value.amount} />;
  return <span className={`${styles.amountLabel} ${styles[params.className]} transactionAmount`}>
    { params.pre }{amount}{ amount !== '-' && ` ${params.pos}` }
  </span>;
};
export default translate()(AmountV2);
