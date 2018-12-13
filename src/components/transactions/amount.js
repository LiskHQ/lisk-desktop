import React from 'react';
import { translate } from 'react-i18next';
import styles from './transactions.css';
import LiskAmount from '../liskAmount';
import transactionTypes from '../../constants/transactionTypes';

const Amount = (props) => {
  const params = {};
  if (props.value.type === transactionTypes.send
    && props.value.senderId === props.value.recipientId) {
    params.className = 'greyLabel';
    params.pre = '';
  } else if (props.value.senderId !== props.address) {
    params.className = 'greenLabel';
    params.pre = '+';
  } else if (props.value.type === transactionTypes.send
      && props.value.recipientId !== props.address) {
    params.pre = '-';
    params.className = 'greyLabel';
  }
  const amount = props.value.type !== transactionTypes.send ? '-' : <LiskAmount val={props.value.amount} />;
  return <span className={`${styles[params.className]} transactionAmount`}>
    { params.pre }{amount}
  </span>;
};
export default translate()(Amount);
