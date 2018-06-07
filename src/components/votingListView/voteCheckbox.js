import React from 'react';
import Spinner from '../spinner';
import { FontIcon } from '../fontIcon';
import styles from './voteCheckbox.css';

const VoteCheckbox = ({ data, status, toggle }) => {
  const {
    username, publicKey, rank, productivity, address,
  } = data;
  const template = status && status.pending ?
    <Spinner /> :
    <label className={styles.checkbox} htmlFor={`vote-${publicKey}`}>
      <input type='checkbox'
        id={`vote-${publicKey}`}
        checked={status ? status.unconfirmed : false}
        onChange={toggle.bind(null, {
 username, publicKey, rank, productivity, address,
})} />
      <FontIcon value='checkmark-check' className={styles.checked} />
      <FontIcon value='checkmark-uncheck' className={styles.unchecked} />
    </label>;
  return template;
};

export default VoteCheckbox;
