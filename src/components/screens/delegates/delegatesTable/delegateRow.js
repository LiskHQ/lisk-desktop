import { Link } from 'react-router-dom';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { tokenMap } from '../../../../constants/tokens';
import AvatarWithNameAndAddress from '../../../shared/avatarWithNameAndAddress';
import LiskAmount from '../../../shared/liskAmount';
import VoteCheckbox from './voteCheckbox';
import routes from '../../../../constants/routes';
import styles from './delegatesTable.css';
import RankOrStatus from './rankOrStatus';
import VoteWeight from './voteWeight';
import { formatAmountBasedOnLocale } from '../../../../utils/formattedNumber';

const DelegateRow = ({
  data, className, shouldShowVoteColumn, firstTimeVotingActive,
  votingModeEnabled, onRowClick, apiVersion,
}) => (
  <div
    className={`${grid.row} ${className} delegate-row`}
    onClick={() => onRowClick(data)}
  >
    <span
      className={`${shouldShowVoteColumn ? grid['col-md-1'] : 'hidden'}`}
    >
      <VoteCheckbox
        delegate={data}
        votingModeEnabled={votingModeEnabled}
        className={styles.checkbox}
        accent={firstTimeVotingActive}
      />
    </span>
    <span className={apiVersion === '3' ? 'hidden' : grid['col-xs-1']}>
      <RankOrStatus data={data} />
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
    <span className={apiVersion === '3' ? grid['col-md-3'] : grid['col-md-2']}>
      <LiskAmount val={data.rewards} token={tokenMap.LSK.key} />
    </span>
    <span className={grid['col-xs-2']}>
      {`${formatAmountBasedOnLocale({ value: data.productivity })} %`}
    </span>
    <span className={grid['col-md-2']}>
      <VoteWeight data={data} />
    </span>
  </div>
);

/* istanbul ignore next */
const areEqual = (prevProps, nextProps) => (prevProps.data.username === nextProps.data.username);

export default React.memo(DelegateRow, areEqual);
