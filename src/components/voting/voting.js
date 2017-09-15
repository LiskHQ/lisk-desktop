import React from 'react';
import { themr } from 'react-css-themr';
import { TABLE } from 'react-toolbox/lib/identifiers';
import { tableFactory } from 'react-toolbox/lib/table/Table';
import { TableHead, TableCell } from 'react-toolbox/lib/table';
import TableTheme from 'react-toolbox/lib/table/theme.css';
import Waypoint from 'react-waypoint';
import Header from './votingHeader';
import VotingRow from './votingRow';

// Create a new Table component injecting Head and Row
const Table = themr(TABLE, TableTheme)(tableFactory(TableHead, VotingRow));

class Voting extends React.Component {
  constructor() {
    super();
    this.state = {
      delegates: [],
      selected: [],
      length: 1,
      notFound: '',
    };
    this.freezeLoading = false;
    this.offset = -1;
    this.query = '';
  }

  componentWillUpdate(nextProps) {
    setTimeout(() => {
      if (this.props.refreshDelegates) {
        this.loadVotedDelegates(true);
      }
    }, 1);
    if (this.props.delegates.length < nextProps.delegates.length) {
      setTimeout(() => {
        this.freezeLoading = false;
        this.offset = nextProps.delegates.length;
      }, 5);
    }
  }

  componentDidMount() {
    this.loadVotedDelegates(true);
  }

  loadVotedDelegates(refresh) {
      /* istanbul-ignore-else */
    if (!this.freezeLoading) {
      this.props.votesFetched({
        activePeer: this.props.activePeer,
        address: this.props.address,
      });
      this.loadDelegates('', refresh);
    }
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
    });
    this.freezeLoading = false;
    setTimeout(() => {
      this.loadDelegates(this.query);
    }, 1);
  }

  /**
   * Fetches a list of delegates
   *
   * @method loadDelegates
   * @param {String} query - The search phrase to match with the delegate name
   *  should replace the old delegates list
   * @param {Number} limit - The maximum number of results
   */
  loadDelegates(search = '', refresh) {
    this.freezeLoading = true;
    this.offset = refresh ? -1 : this.offset;
    this.props.delegatesFetched({
      activePeer: this.props.activePeer,
      offset: this.offset > -1 ? this.offset : 0,
      q: search || '',
      refresh,
    });
  }

  /**
   * load more data when scroll bar reaches end of the page
   */
  loadMore() {
    /* istanbul-ignore-else */
    if (!this.freezeLoading && this.props.totalDelegates > this.offset) {
      this.loadDelegates(this.query);
    }
  }

  render() {
    // .log(this.props.votes.cc001);
    return (
      <div className="box noPaddingBox">
        <Header
          setActiveDialog={this.props.setActiveDialog}
          voteToggled={this.props.voteToggled}
          addTransaction={this.props.addTransaction}
          votes={this.props.votes}
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
            {this.props.delegates.map(item => (
              <VotingRow key={item.address} data={item}
                voteToggled={this.props.voteToggled}
                voteStatus={this.props.votes[item.username]}
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
