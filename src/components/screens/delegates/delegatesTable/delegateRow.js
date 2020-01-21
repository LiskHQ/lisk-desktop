import { Link } from 'react-router-dom';
import React from 'react';
import isEqual from 'react-fast-compare';
import { useDispatch, useSelector } from 'react-redux';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { tokenMap } from '../../../../constants/tokens';
import AvatarWithNameAndAddress from '../../../shared/avatarWithNameAndAddress';
import LiskAmount from '../../../shared/liskAmount';
import VoteCheckbox from './voteCheckbox';
import routes from '../../../../constants/routes';
import styles from './delegatesTable.css';
import { formatAmountBasedOnLocale } from '../../../../utils/formattedNumber';
import { voteToggled } from '../../../../actions/voting';

const DelegateRow = (props) => {
  const {
    data, className, shouldShowVoteColumn, firstTimeVotingActive,
    votingModeEnabled,
  } = props;
  const dispatch = useDispatch();
  const voteStatus = useSelector(state => state.voting.votes[data.username]);
  return (
    <div
      className={`${grid.row} ${className} delegate-row`}
      onClick={() => {
        if (votingModeEnabled) {
          dispatch(voteToggled(data));
        }
      }}
    >
      <span
        className={`${shouldShowVoteColumn ? grid['col-md-1'] : 'hidden'} checkbox-column`}
      >
        <VoteCheckbox
          voteStatus={voteStatus || {}}
          delegate={data}
          votingModeEnabled={votingModeEnabled}
          className={styles.checkbox}
          accent={firstTimeVotingActive}
        />
      </span>
      <span className={grid['col-xs-1']}>
        {`#${data.rank}`}
      </span>
      <span className={`${shouldShowVoteColumn ? grid['col-xs-4'] : grid['col-xs-5']}`}>
        <Link
          className={styles.delegateLink}
          to={shouldShowVoteColumn
            ? routes.delegates.path
            : `${routes.accounts.pathPrefix}${routes.accounts.path}/${data.account.address}`}
        >
          <AvatarWithNameAndAddress {...data} />
        </Link>
      </span>
      <span className={grid['col-md-2']}>
        <LiskAmount val={data.rewards} token={tokenMap.LSK.key} />
      </span>
      <span className={grid['col-xs-2']}>
        {`${formatAmountBasedOnLocale({ value: data.productivity })} %`}
      </span>
      <span className={grid['col-md-2']}>
        <strong><LiskAmount val={data.vote} roundTo={0} token={tokenMap.LSK.key} /></strong>
      </span>
    </div>
  );
};

/* istanbul ignore next */
const areEqual = (prevProps, nextProps) => (
  prevProps.data.username === nextProps.data.username
  && prevProps.shouldShowVoteColumn === nextProps.shouldShowVoteColumn
  && prevProps.votingModeEnabled === nextProps.votingModeEnabled
  && isEqual(prevProps.voteStatus, nextProps.voteStatus)
);

export default React.memo(DelegateRow, areEqual);
