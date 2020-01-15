import { Link } from 'react-router-dom';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { tokenMap } from '../../../../constants/tokens';
import AvatarWithNameAndAddress from '../../../shared/avatarWithNameAndAddress';
import LiskAmount from '../../../shared/liskAmount';
import VoteCheckbox from './voteCheckbox';
import routes from '../../../../constants/routes';
import styles from './delegatesTable.css';
import { formatAmountBasedOnLocale } from '../../../../utils/formattedNumber';

const DelegateRow = React.memo(({
  data, className, shouldShowVoteColumn, firstTimeVotingActive,
}) => (
  <div className={`${grid.row} ${className} delegate-row`}>
    <span className={`${shouldShowVoteColumn ? grid['col-md-1'] : 'hidden'}`}>
      <VoteCheckbox
        delegate={data}
        votingModeEnabled={shouldShowVoteColumn}
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
));

export default DelegateRow;
