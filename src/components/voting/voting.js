import React from 'react';
import { themr } from 'react-css-themr';
import { TABLE } from 'react-toolbox/lib/identifiers';
import { tableFactory } from 'react-toolbox/lib/table/Table';
import { TableHead, TableCell } from 'react-toolbox/lib/table';
import TableTheme from 'react-toolbox/lib/table/theme.css';
import Waypoint from 'react-waypoint';
import { listAccountDelegates, listDelegates } from '../../utils/api/delegate';
import Header from './votingHeader';
import VotingRow from './votingRow';

// Create a new Table component injecting Head and Row
const Table = themr(TABLE, TableTheme)(tableFactory(TableHead, VotingRow));

class Voting extends React.Component {
  constructor() {
    super();
    this.state = {
      delegates: [],
      votedDelegates: [],
      selected: [],
      offset: 0,
      loadMore: false,
      length: 1,
      notFound: '',
    };
    this.query = '';
  }

  componentWillReceiveProps() {
    setTimeout(() => {
      if (this.props.refreshDelegates) {
        this.loadVotedDelegates(true);
      } else {
        const delegates = this.state.delegates.map(delegate => this.setStatus(delegate));
        this.setState({
          delegates,
        });
      }
    }, 1);
  }

  componentDidMount() {
    this.loadVotedDelegates();
  }

  loadVotedDelegates(refresh) {
    listAccountDelegates(this.props.activePeer, this.props.address).then((res) => {
      if (res.delegates) {
        const votedDelegates = res.delegates
          .map(delegate => Object.assign({}, delegate, { voted: true }));
        this.setState({
          votedDelegates,
        });
      }
      if (refresh) {
        setTimeout(() => {
          const delegates = this.state.delegates.map(delegate => this.setStatus(delegate));
          this.setState({
            delegates,
          });
        }, 10);
      } else {
        this.loadDelegates(this.query);
      }
    })
    .catch(() => {
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
    }, 1);
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
      this.props.activePeer, {
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
        notFound: delegatesList.length > 0 ? '' : <div className="hasPaddingRow empty-message">No delegates found</div>,
      });
    });
  }

  /**
   * Sets delegate.status to be always the same object for given delegate.address
   */
  setStatus(delegate) {
    let delegateExisted = false;
    if (this.props.unvotedList.length > 0) {
      this.props.unvotedList.forEach((row) => {
        if (row.address === delegate.address) {
          delegateExisted = row;
        }
      });
    }
    if (this.props.votedList.length > 0) {
      this.props.votedList.forEach((row) => {
        if (row.address === delegate.address) {
          delegateExisted = row;
        }
      });
    }
    if (delegateExisted) {
      return delegateExisted;
    }
    const voted = this.state.votedDelegates
      .filter(row => row.username === delegate.username).length > 0;
    return Object.assign(delegate, { voted }, { selected: voted }, { pending: false });
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
        <Header
          setActiveDialog={this.props.setActiveDialog}
          addToUnvoted={this.props.addToUnvoted}
          addTransaction={this.props.addTransaction}
          votedList={this.props.votedList}
          unvotedList={this.props.unvotedList}
          votedDelegates={this.state.votedDelegates}
          search={ value => this.search(value) }
        />
        <div className='verticalScroll'>
          <Table selectable={false} >
            <TableHead displaySelect={false}>
              <TableCell>Vote</TableCell>
              <TableCell>Rank</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Lisk Address</TableCell>
              <TableCell>Uptime</TableCell>
              <TableCell>Approval</TableCell>
            </TableHead>
            {this.state.delegates.map(item => (
              <VotingRow key={item.address} data={item}
                addToVoteList={this.props.addToVoteList}
                removeFromVoteList={this.props.removeFromVoteList}
              />
            ))}
          </Table>
        </div>
        {this.state.notFound}
        <Waypoint bottomOffset='-80%'
                  scrollableAncestor={window}
                  key={this.state.delegates.length}
                  onEnter={this.loadMore.bind(this)}></Waypoint>
      </div>
    );
  }
}

export default Voting;
