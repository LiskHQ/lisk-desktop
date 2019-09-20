import React from 'react';
import { Link } from 'react-router-dom';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from './votingListView.css';
import VoteCheckbox from './voteCheckbox';
import TableRow from '../toolbox/table/tableRow';
import AccountVisual from '../toolbox/accountVisual';
import LiskAmount from '../liskAmount';
import routes from '../../constants/routes';
import { formatAmountBasedOnLocale } from '../../utils/formattedNumber';

const setRowClass = (voteStatus) => {
  if (!voteStatus) {
    return '';
  }
  const { pending, confirmed, unconfirmed } = voteStatus;
  if (pending) {
    return 'pendingRow';
  } if (confirmed !== unconfirmed) {
    return confirmed ? `${styles.downVoteRow} selected-row` : `${styles.upVoteRow} selected-row`;
  }
  return confirmed ? styles.votedRow : '';
};

class DelegateRow extends React.Component {
  shouldComponentUpdate({
    voteStatus, ...nextProps
  }) {
    const oldStatus = this.props.voteStatus;
    return (!oldStatus && !!voteStatus)
      || (!!oldStatus && !voteStatus)
      || ((!!oldStatus && !!voteStatus)
      && (oldStatus.unconfirmed !== voteStatus.unconfirmed
      || oldStatus.pending !== voteStatus.pending))
      || this.didPropsChange(nextProps, [
        'votingModeEnabled',
        'shouldShowVoteColumn',
        'shouldHightlightCheckbox',
      ]);
  }

  didPropsChange(nextProps, keys) {
    return keys.filter(key => this.props[key] !== nextProps[key]).length > 0;
  }

  render() {
    const {
      data, voteStatus, voteToggled, className,
      votingModeEnabled, shouldShowVoteColumn,
      shouldHightlightCheckbox,
      columnClassNames,
    } = this.props;
    const {
      username,
      rank,
      productivity,
      account,
      rewards,
    } = data;

    return (
      <TableRow
        className={`delegate-row ${className} ${grid.row} ${styles.row} ${setRowClass(voteStatus)}`}
        onClick={() => (
          votingModeEnabled ? voteToggled({
            username,
            publicKey: account.publicKey,
            rank,
            productivity,
            address: account.address,
          }) : null
        )}
      >
        {shouldShowVoteColumn ? (
          <div className={`${columnClassNames.vote} ${styles.leftText}`}>
            <VoteCheckbox
              className={styles.checkbox}
              accent={shouldHightlightCheckbox}
              toggle={voteToggled}
              value={data.selected}
              status={voteStatus}
              data={data}
              votingModeEnabled={votingModeEnabled}
            />
          </div>
        ) : null}
        <div className={`${columnClassNames.rank} delegate-rank`}>
          {`#${rank}`}
        </div>
        <div className={`${columnClassNames.delegate} delegate-info`}>
          <Link
            className={styles.delegateLink}
            to={`${routes.accounts.pathPrefix}${routes.accounts.path}/${account.address}`}
          >
            <AccountVisual
              className={`${styles.avatar} tx-avatar`}
              address={account.address}
              size={36}
            />
            <div className={styles.accountInfo}>
              <span className={`delegate-name ${styles.title}`}>{username}</span>
              <span className={`delegate-id ${styles.address}`}>{account.address}</span>
            </div>
          </Link>
        </div>
        <div className={`${columnClassNames.forged} ${styles.forged} delegate-forged`}>
          <LiskAmount val={rewards} />
          {` ${this.props.t('LSK')}`}
        </div>
        <div className={`${columnClassNames.productivity} delegate-productivity`}>
          {`${formatAmountBasedOnLocale({ value: productivity })} %`}
        </div>
        <div className={`${columnClassNames.voteWeight} ${styles.weight} vote-weight`}>
          <LiskAmount val={data.vote} />
          {` ${this.props.t('LSK')}`}
        </div>
      </TableRow>
    );
  }
}

export default DelegateRow;
