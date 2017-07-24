import React from 'react';
import { Table, TableHead, TableRow, TableCell } from 'react-toolbox/lib/table';
import { listAccountDelegates, listDelegates } from '../../utils/api/delegate';
import VotingHeader from './votingHeader';
import styles from './voting.css';

class VotingComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      delegates: [],
      selected: [],
      query: '',
    };
  }
  componentDidMount() {
    listAccountDelegates(this.props.activePeer, this.props.address).then((res) => {
      this.setState({
        delegates: res.delegates,
      });
    });
  }
  search(value) {
    listDelegates(this.props.activePeer, { q: value }).then((res) => {
      this.setState({
        delegates: res.delegates,
      });
    });
  }
  handleRowSelect(selected) {
    // this.setState({ selected: selected.map(item => sortedData[item].name) });
    this.setState({
      selected: selected.map(item => this.state.delegates[item].username),
    });
  }
  render() {
    return (
      <div className="box">
        <VotingHeader search={ value => this.search(value) }></VotingHeader>
        <Table className={styles.table}
          onRowSelect={ selected => this.handleRowSelect(selected) }
          multiSelectable={true}
        >
          <TableHead displaySelect={false}>
            <TableCell numeric>Vote</TableCell>
            <TableCell numeric>Rank</TableCell>
            <TableCell numeric>Name</TableCell>
            <TableCell numeric>Uptime</TableCell>
            <TableCell numeric>Uptime</TableCell>
            <TableCell numeric>Approval</TableCell>
          </TableHead>
          {this.state.delegates.map((item, idx) => (
            <TableRow key={idx} selected={this.state.selected.indexOf(item.username) !== -1}>
              <TableCell numeric>{item.rank}</TableCell>
              <TableCell numeric>{item.username}</TableCell>
              <TableCell numeric>{item.address}</TableCell>
              <TableCell numeric>{item.productivity} %</TableCell>
              <TableCell numeric>{item.approval} %</TableCell>
            </TableRow>
          ))}
        </Table>
      </div>
    );
  }
}

export default VotingComponent;
