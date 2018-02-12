import React from 'react';
import { translate } from 'react-i18next';
import styles from './transactions.css';
import LiskAmount from '../liskAmount';
import transactionTypes from '../../constants/transactionTypes';

const Amount = (props) => {
  const params = {};
  if (props.value.type === transactionTypes.send &&
    props.value.senderId === props.value.recipientId) {
    params.className = 'greyLabel';
    params.pre = '';
  } else if (props.value.senderId !== props.address) {
    params.className = 'greenLabel';
    params.pre = '+';
  } else if ((props.value.type !== transactionTypes.send ||
      props.value.recipientId !== props.address) && props.value.amount !== 0) {
    params.pre = '-';
    params.className = 'greyLabel';
    params.clickToSendEnabled = props.value.type === transactionTypes.send;
  }

  return <span id='transactionAmount' className={styles[params.className]}>
    { params.pre }<LiskAmount val={props.value.amount} />
  </span>;
};
export default translate()(Amount);
