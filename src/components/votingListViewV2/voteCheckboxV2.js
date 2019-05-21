import React from 'react';
import Spinner from '../spinner';
import { FontIcon } from '../fontIcon';
import styles from './voteCheckboxV2.css';
import svgIcons from '../../utils/svgIcons';

// eslint-disable-next-line complexity
const VoteCheckboxV2 = ({
  data, status, toggle, votingModeEnabled, accent,
}) => {
  const {
    username, rank, productivity, account,
  } = data;
  const removed = status && status.confirmed && !status.unconfirmed;
  const added = status && !status.confirmed && status.unconfirmed;
  const template = status && status.pending ?
    <Spinner /> :
    <React.Fragment> { votingModeEnabled ?
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
        <FontIcon value='checkmark-check' className={`${styles.checked} ${(accent || added) && styles.accent}`} />
        <FontIcon value='checkmark-uncheck' className={`${styles.unchecked} ${accent && styles.accent} ${removed && styles.removed}`} />
      </label> :
      <img src={status && status.unconfirmed ? svgIcons.ok_icon : undefined} />
    } </React.Fragment>;
  return template;
};

export default VoteCheckboxV2;
