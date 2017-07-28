import React from 'react';
import { Table, TableHead, TableRow, TableCell } from 'react-toolbox/lib/table';
import Waypoint from 'react-waypoint';
import Checkbox from 'react-toolbox/lib/checkbox';
import { listAccountDelegates, listDelegates } from '../../utils/api/delegate';
import VotingHeader from './votingHeader';
import styles from './voting.css';

const setRowClass = (item) => {
  let className = '';
  if (item.status.selected && item.status.voted) {
    className = styles.votedRow;
  } else if (!item.status.selected && item.status.voted) {
    className = styles.downVoteRow;
  } else if (item.status.selected && !item.status.voted) {
    className = styles.upVoteRow;
  }
  return className;
};

class VotingComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      delegates: [],
      selected: [],
      query: '',
      offset: 0,
      loadMore: true,
      length: 1,
      notFound: '',
    };
    this.delegates = [];
    this.query = '';
  }
  componentDidMount() {
    listAccountDelegates(this.props.activePeer, this.props.address).then((res) => {
      this.votedDelegates = [];
      res.delegates.forEach(delegate => this.votedDelegates.push(delegate.username));
      this.loadDelegates(this.query);
    });
  }
  /**
   * Fetches a list of delegates based on the given search phrase
   * @param {string} query - username of a delegate
   */
  search(query) {
    this.query = query;
    this.setState({
      offset: 0,
      delegates: [],
      length: 1,
      loadMore: false,
    });
    setTimeout(() => {
      this.loadDelegates(this.query);
    }, 100);
  }
  /**
   * Fetches a list of delegates
   *
   * @method loadDelegates
   * @param {String} search - The search phrase to match with the delegate name
   *  should replace the old delegates list
   * @param {Number} limit - The maximum number of results
   */
  loadDelegates(search, limit = 100) {
    this.setState({ loadMore: false });
    listDelegates(
      this.props.activePeer,
      {
        offset: this.state.offset,
        limit: limit.toString(),
        q: search,
      },
    ).then((res) => {
      const delegatesList = res.delegates
                              .map(delegate => this.setStatus(delegate));
      this.setState({
        delegates: [...this.state.delegates, ...delegatesList],
        offset: this.state.offset + delegatesList.length,
        length: parseInt(res.totalCount, 10),
        loadMore: true,
        notFound: delegatesList.length > 0 ? '' : <div className="hasPaddingRow">No delegates found</div>,
      });
    });
  }
  /**
   * Sets deleagte.status to be always the same object for given delegate.address
   */
  setStatus(delegate) {
    let item = delegate;// eslint-disable-line
    const voted = this.votedDelegates.indexOf(delegate.username) > -1;
    item.status = {
      voted,
      selected: voted,
    };
    return item;
  }

  /**
   * change status of selected row
   * @param {integer} index - index of row that we want to change status of that
   * @param {boolian} value - value of checkbox
   */
  handleChange(index, value) {
    let delegates = this.state.delegates; // eslint-disable-line
    delegates[index].status.selected = value;
    this.setState({ delegates });
  }
  /**
   * load more data when scroll bar reachs end of the page
   */
  loadMore() {
    if (this.state.loadMore && this.state.length > this.state.offset) {
      this.loadDelegates(this.query);
    }
  }
  render() {
    return (
      <div className="box noPaddingBox">
        <VotingHeader search={ value => this.search(value) }></VotingHeader>
        <Table selectable={false}
        >
          <TableHead displaySelect={false}>
            <TableCell>Vote</TableCell>
            <TableCell>Rank</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Lisk Address</TableCell>
            <TableCell>Uptime</TableCell>
            <TableCell>Approval</TableCell>
          </TableHead>
          {this.state.delegates.map((item, idx) => (
            <TableRow key={idx} className={`${styles.row} ${setRowClass(item)}`}>
              <TableCell>
                <Checkbox className={styles.field}
                  checked={item.status.selected}
                  onChange={this.handleChange.bind(this, idx)}
                />
              </TableCell>
              <TableCell>{item.rank}</TableCell>
              <TableCell>{item.username}</TableCell>
              <TableCell>{item.address}</TableCell>
              <TableCell>{item.productivity} %</TableCell>
              <TableCell>{item.approval} %</TableCell>
            </TableRow>
          ))}
        </Table>
        {this.state.notFound}
        <Waypoint onEnter={this.loadMore.bind(this)}></Waypoint>
      </div>
    );
  }
}

export default VotingComponent;
