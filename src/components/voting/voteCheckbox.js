import React from 'react';
import Checkbox from 'react-toolbox/lib/checkbox';
import Spinner from '../spinner';

const VoteCheckbox = (props) => {
  const template = props.status && props.status.pending ?
    <Spinner /> :
    <Checkbox
      className={props.styles.field}
      checked={props.status.unconfirmed}
      onChange={props.toggle.bind(null, props.data.username)}
    />;
  return template;
};

export default VoteCheckbox;
