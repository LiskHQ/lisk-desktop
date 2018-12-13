import React from 'react';
import Spinner from '../spinner';
import { FontIcon } from '../fontIcon';
import styles from './voteCheckbox.css';

const VoteCheckbox = ({ data, status, toggle }) => {
  const {
    username, rank, productivity, account,
  } = data;
  const template = status && status.pending ?
    <Spinner /> :
    <label className={`${styles.checkbox} vote-checkbox ${status ? 'checked' : 'unchecked'}`} htmlFor={`vote-${account.publicKey}`}>
      <input type='checkbox'
        id={`vote-${account.publicKey}`}
        checked={status ? status.unconfirmed : false}
        onChange={toggle.bind(null, {
          username,
          publicKey: account.publicKey,
          rank,
          productivity,
          address: account.address,
        })} />
      <FontIcon value='checkmark-check' className={styles.checked} />
      <FontIcon value='checkmark-uncheck' className={styles.unchecked} />
    </label>;
  return template;
};

export default VoteCheckbox;
