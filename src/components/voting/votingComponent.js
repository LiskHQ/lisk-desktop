import React from 'react';
import { Table, TableHead, TableRow, TableCell } from 'react-toolbox/lib/table';
import { listAccountDelegates, listDelegates } from '../../utils/api/delegate';
import VotingHeader from './votingHeader';
// import styles from './voting.css';

class Voting extends React.Component {
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
      console.log(res);
      this.setState({
        delegates: res.delegates,
      });
    });
  }
  search(value) {
    listDelegates(this.props.activePeer, { q: value }).then((res) => {
      console.log(res);
      this.setState({
        delegates: res.delegates,
      });
    });
  }
  handleRowSelect(selected) {
    console.log(selected);
    // this.setState({ selected: selected.map(item => sortedData[item].name) });
    this.setState({
      selected: selected.map(item => this.state.delegates[item].username),
    });
  }
  render() {
    return (
      <div className="box">
        <VotingHeader search={ value => this.search(value) }></VotingHeader>
        <Table
          onRowSelect={ selected => this.handleRowSelect(selected) }
          Selectable={false}
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

export default Voting;
