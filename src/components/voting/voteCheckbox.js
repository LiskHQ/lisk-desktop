import React from 'react';
import Checkbox from 'react-toolbox/lib/checkbox';
import Spinner from '../spinner';

const VoteCheckbox = ({ data, status, styles, toggle }) => {
  const { username, publicKey } = data;
  const template = status && status.pending ?
    <Spinner /> :
    <Checkbox
      className={styles.field}
      checked={status ? status.unconfirmed : false}
      onChange={toggle.bind(null, { username, publicKey })}
    />;
  return template;
};

export default VoteCheckbox;
