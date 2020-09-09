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
import RankOrStatus from '../../../shared/rankOrStatus';
import VoteWeight from '../../../shared/voteWeight';
import { formatAmountBasedOnLocale } from '../../../../utils/formattedNumber';
import { voteToggled } from '../../../../actions/voting';

const AddressWrapper = ({ votingModeEnabled, address, children }) => {
  if (votingModeEnabled) {
    return (<div className={styles.delegateLink}>{children}</div>);
  }
  return (
    <Link
      className={styles.delegateLink}
      to={`${routes.account.path}?address=${address}`}
    >
      {children}
    </Link>
  );
};

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
      {
        firstTimeVotingActive ? <div className={styles.highlight} /> : null
      }
      <span
        className={`${styles.checkboxWrapper} ${shouldShowVoteColumn ? grid['col-xs-1'] : 'hidden'} checkbox-column`}
      >
        <VoteCheckbox
          voteStatus={voteStatus || {}}
          delegate={data}
          votingModeEnabled={votingModeEnabled}
          className={styles.checkbox}
          accent={firstTimeVotingActive}
        />
      </span>
      <span className="hidden">
        <RankOrStatus data={data} />
      </span>
      <span className={`${shouldShowVoteColumn ? grid['col-xs-4'] : grid['col-xs-5']}`}>
        <AddressWrapper
          address={data.address}
          votingModeEnabled={votingModeEnabled}
        >
          <AvatarWithNameAndAddress username={data.username} account={{ address: data.address }} />
        </AddressWrapper>
      </span>
      <span className={grid['col-md-3']}>
        <LiskAmount val={data.rewards} token={tokenMap.LSK.key} />
      </span>
      <span className={grid['col-xs-2']}>
        {`${formatAmountBasedOnLocale({ value: data.productivity })} %`}
      </span>
      <span className={grid['col-xs-2']}>
        <VoteWeight data={data} />
      </span>
    </div>
  );
};

/* istanbul ignore next */
const areEqual = (prevProps, nextProps) => (
  prevProps.firstTimeVotingActive === nextProps.firstTimeVotingActive
  && prevProps.data.username === nextProps.data.username
  && prevProps.shouldShowVoteColumn === nextProps.shouldShowVoteColumn
  && prevProps.votingModeEnabled === nextProps.votingModeEnabled
  && isEqual(prevProps.voteStatus, nextProps.voteStatus)
);

export default React.memo(DelegateRow, areEqual);
