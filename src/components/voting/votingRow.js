import React from 'react';
import { TableRow, TableCell } from 'react-toolbox/lib/table';
import styles from './voting.css';
import Checkbox from './voteCheckbox';

const setRowClass = ({ pending, selected, voted }) => {
  if (pending) {
    return styles.pendingRow;
  } else if (selected) {
    return voted ? styles.votedRow : styles.upVoteRow;
  }
  return voted ? styles.downVoteRow : '';
};

const VotingRow = (props) => {
  const { data } = props;
  return (<TableRow {...props} className={`${styles.row} ${setRowClass(data)}`}>
      <TableCell>
        <Checkbox styles={styles}
          value={data.selected}
          pending={data.pending}
          data={data}
        />
      </TableCell>
      <TableCell>{data.rank}</TableCell>
      <TableCell>{data.username}</TableCell>
      <TableCell>{data.address}</TableCell>
      <TableCell>{data.productivity} %</TableCell>
      <TableCell>{data.approval} %</TableCell>
    </TableRow>
  );
};

export default VotingRow;
