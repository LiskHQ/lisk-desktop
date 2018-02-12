import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from './delegateList.css';
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
    return (<ul className={`${styles.row} ${grid.row} ${setRowClass(voteStatus)}`}>
      <li className={`${grid['col-lg-1']} ${grid['col-xs-2']}`}>
        <Checkbox styles={styles}
          toggle={voteToggled}
          value={data.selected}
          status={voteStatus}
          data={data}
        />
      </li>
      <li className={`${grid['col-lg-1']} ${grid['col-xs-2']}`}>{data.rank}</li>
      <li className={`${grid['col-lg-3']} ${grid['col-xs-5']}`}>{data.username}</li>
      <li className={`${grid['col-lg-5']}`}>{data.address}</li>
      <li className={`${grid['col-lg-2']} ${grid['col-xs-3']}`}>{data.productivity} %</li>
    </ul>
    );
  }
}

export default VotingRow;
