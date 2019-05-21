import React from 'react';
import Spinner from '../spinner';
import svgIcons from '../../utils/svgIcons';

import CheckBox from '../toolbox/checkBox';

const VoteCheckboxV2 = ({
  data, status = {}, toggle, votingModeEnabled, accent,
}) => {
  const {
    username, rank, productivity, account,
  } = data;
  const removed = status.confirmed && !status.unconfirmed;
  const added = !status.confirmed && status.unconfirmed;
  const template = status.pending ?
    <Spinner /> :
    <React.Fragment> { votingModeEnabled ?
      <CheckBox
        className='vote-checkbox'
        checked={status.unconfirmed}
        added={added}
        accent={accent}
        removed={removed}
        id={`vote-${account.publicKey}`}
        onChange={toggle.bind(null, {
          username,
          publicKey: account.publicKey,
          rank,
          productivity,
          address: account.address,
        })}
      /> :
      <img src={status.unconfirmed ? svgIcons.ok_icon : undefined} />
    } </React.Fragment>;
  return template;
};

export default VoteCheckboxV2;
