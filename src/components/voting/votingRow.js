import React from 'react';
import { TableRow, TableCell } from 'react-toolbox/lib/table';
import styles from './voting.css';
import SelectableRow from './selectableRow';

const setRowClass = (item) => {
  let className = '';
  if (item.pending) {
    className = styles.pendingRow;
  } else if (item.selected && item.voted) {
    className = styles.votedRow;
  } else if (!item.selected && item.voted) {
    className = styles.downVoteRow;
  } else if (item.selected && !item.voted) {
    className = styles.upVoteRow;
  }
  return className;
};
const VotingRow = props => (<TableRow {...props} className={`${styles.row} ${setRowClass(props.data)}`}>
    <TableCell>
      <SelectableRow styles={styles}
        value={props.data.selected}
        pending={props.data.pending}
        data={props.data}
      />
    </TableCell>
    <TableCell>{props.data.rank}</TableCell>
    <TableCell>{props.data.username}</TableCell>
    <TableCell>{props.data.address}</TableCell>
    <TableCell>{props.data.productivity} %</TableCell>
    <TableCell>{props.data.approval} %</TableCell>
  </TableRow>
);

export default VotingRow;
