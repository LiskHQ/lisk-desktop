import React from 'react';
import Spinner from '../../../toolbox/spinner';
import CheckBox from '../../../toolbox/checkBox';
import Icon from '../../../toolbox/icon';

const VoteCheckbox = ({
  delegate, toggle, votingModeEnabled, accent, className,
}) => {
  const {
    username, rank, productivity, account, voteStatus = {},
  } = delegate;
  const removed = voteStatus.confirmed && !voteStatus.unconfirmed;
  const added = !voteStatus.confirmed && voteStatus.unconfirmed;
  return voteStatus.pending
    ? <Spinner />
    : (
      <React.Fragment>
        { votingModeEnabled
          ? (
            <CheckBox
              className={`${className} vote-checkbox`}
              checked={voteStatus.unconfirmed}
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
          : voteStatus.unconfirmed && <Icon name="checkmark" />
        }
      </React.Fragment>
    );
};

export default VoteCheckbox;
