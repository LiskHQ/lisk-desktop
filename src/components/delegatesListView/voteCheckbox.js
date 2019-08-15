import React from 'react';
import Spinner from '../spinner/spinner';
import CheckBox from '../toolbox/checkBox';
import Icon from '../toolbox/icon';

const VoteCheckbox = ({
  data, status = {}, toggle, votingModeEnabled, accent, className,
}) => {
  const {
    username, rank, productivity, account,
  } = data;
  const removed = status.confirmed && !status.unconfirmed;
  const added = !status.confirmed && status.unconfirmed;
  const template = status.pending
    ? <Spinner />
    : (
      <React.Fragment>
        {' '}
        { votingModeEnabled
          ? (
            <CheckBox
              className={`${className} vote-checkbox`}
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
            />
          )
          : status.unconfirmed && <Icon name="checkmark" />
    }
        {' '}
      </React.Fragment>
    );
  return template;
};

export default VoteCheckbox;
