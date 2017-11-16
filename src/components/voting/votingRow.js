import React from 'react';
import { TBTableRow, TBTableCell } from '../toolbox/tables/table';
import styles from './voting.css';
import Checkbox from './voteCheckbox';

const setRowClass = (voteStatus) => {
  if (!voteStatus) {
    return '';
  }
  const { pending, confirmed, unconfirmed } = voteStatus;
  if (pending) {
    return styles.pendingRow;
  } else if (confirmed !== unconfirmed) {
    return confirmed ? styles.downVoteRow : styles.upVoteRow;
  }
  return confirmed ? styles.votedRow : '';
};

class VotingRow extends React.Component {
  // eslint-disable-next-line class-methods-use-this
  shouldComponentUpdate({ voteStatus }) {
    const oldStatus = this.props.voteStatus;
    return (!oldStatus && !!voteStatus) ||
      (!!oldStatus && !voteStatus) ||
      ((!!oldStatus && !!voteStatus) &&
      (oldStatus.unconfirmed !== voteStatus.unconfirmed ||
      oldStatus.pending !== voteStatus.pending));
  }

  render() {
    const { data, voteStatus, voteToggled } = this.props;
    return (<TBTableRow className={`${styles.row} ${setRowClass(voteStatus)}`}>
      <TBTableCell>
        <Checkbox styles={styles}
          toggle={voteToggled}
          value={data.selected}
          status={voteStatus}
          data={data}
        />
      </TBTableCell>
      <TBTableCell>{data.rank}</TBTableCell>
      <TBTableCell>{data.username}</TBTableCell>
      <TBTableCell>{data.address}</TBTableCell>
      <TBTableCell>{data.productivity} %</TBTableCell>
      <TBTableCell>{data.approval} %</TBTableCell>
    </TBTableRow>
    );
  }
}

export default VotingRow;
