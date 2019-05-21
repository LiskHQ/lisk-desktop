import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from './votingListViewV2.css';
import Checkbox from './voteCheckboxV2';
import TableRow from '../toolbox/table/tableRow';
import AccountVisual from '../accountVisual';
import LiskAmount from '../liskAmount';

const setRowClass = (voteStatus) => {
  if (!voteStatus) {
    return '';
  }
  const { pending, confirmed, unconfirmed } = voteStatus;
  if (pending) {
    return 'pendingRow';
  } else if (confirmed !== unconfirmed) {
    return confirmed ? `${styles.downVoteRow} selected-row` : `${styles.upVoteRow} selected-row`;
  }
  return confirmed ? styles.votedRow : '';
};

class DelegateRowV2 extends React.Component {
  shouldComponentUpdate({ voteStatus, votingModeEnabled }) {
    const oldStatus = this.props.voteStatus;
    return (!oldStatus && !!voteStatus) ||
      (!!oldStatus && !voteStatus) ||
      ((!!oldStatus && !!voteStatus) &&
      (oldStatus.unconfirmed !== voteStatus.unconfirmed ||
      oldStatus.pending !== voteStatus.pending)) ||
      this.props.votingModeEnabled !== votingModeEnabled;
  }

  render() {
    const {
      data, voteStatus, voteToggled, className, votingModeEnabled, shouldShowVoteColumn,
    } = this.props;

    return (
      <TableRow className={`delegate-row ${className} ${grid.row} ${styles.row} ${setRowClass(voteStatus)}`}>
        {shouldShowVoteColumn ? <div className={`${grid['col-md-1']} ${grid['col-xs-2']}
          ${styles.leftText} ${styles.checkBoxContainer}`}>
          <Checkbox styles={`${styles} ${styles.fakeCheckbox}`}
            toggle={voteToggled}
            value={data.selected}
            status={voteStatus}
            data={data}
            votingModeEnabled={votingModeEnabled}
          />
        </div> : null}
        <div className={`${grid['col-md-1']} ${grid['col-xs-2']} delegate-rank`}>#{data.rank}</div>
        <div className={`${grid['col-md-3']} ${grid['col-xs-5']} delegate-info`}>
          <AccountVisual
            className={`${styles.avatar} tx-avatar`}
            address={data.account.address}
            size={36} />
          <div className={styles.accountInfo}>
            <span className={`delegate-name ${styles.title}`}>{data.username}</span>
            <span className={`delegate-id ${styles.address}`}>{data.account.address}</span>
          </div>
        </div>
        <div className={`${grid[shouldShowVoteColumn ? 'col-md-3' : 'col-md-4']} ${grid['col-xs-3']} ${styles.productivity} delegate-productivity`}>{data.productivity} %</div>
        <div className={`${grid['col-md-4']} ${styles.weight} vote-weight`}>
          <LiskAmount val={data.vote} /> {this.props.t(' LSK')}
        </div>
      </TableRow>
    );
  }
}

export default DelegateRowV2;
