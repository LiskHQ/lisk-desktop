import { TABLE } from 'react-toolbox/lib/identifiers';
import { TableHead, TableCell } from 'react-toolbox/lib/table';
import { tableFactory } from 'react-toolbox/lib/table/Table';
import { themr } from 'react-css-themr';
import React from 'react';
import TableTheme from 'react-toolbox/lib/table/theme.css';
import Waypoint from 'react-waypoint';

import Header from './votingHeader';
import VotingBar from './votingBar';
import VotingRow from './votingRow';

// Create a new Table component injecting Head and Row
const Table = themr(TABLE, TableTheme)(tableFactory(TableHead, VotingRow));

class Voting extends React.Component {
  constructor() {
    super();
    this.freezeLoading = false;
    this.isInitial = true;
    this.offset = -1;
    this.query = '';
  }

  componentWillUpdate(nextProps) {
    if (!this.props.refreshDelegates && nextProps.refreshDelegates) {
      this.loadVotedDelegates(true);
    }

    if (this.props.delegates.length < nextProps.delegates.length) {
      setTimeout(() => {
        this.freezeLoading = false;
        this.offset = nextProps.delegates.length;
        this.isInitial = false;
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
    this.offset = 0;
    this.freezeLoading = false;
    this.loadDelegates(query, true);
  }

  /**
   * Fetches a list of delegates
   *
   * @method loadDelegates
   * @param {String} query - The search phrase to match with the delegate name
   *  should replace the old delegates list
   * @param {Number} limit - The maximum number of results
   */
  loadDelegates(q = '', refresh) {
    this.freezeLoading = true;
    this.offset = refresh ? -1 : this.offset;
    this.props.delegatesFetched({
      activePeer: this.props.activePeer,
      offset: this.offset > -1 ? this.offset : 0,
      q,
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
              <TableCell>{this.props.t('Vote', { context: 'verb' })}</TableCell>
              <TableCell>{this.props.t('Rank')}</TableCell>
              <TableCell>{this.props.t('Name')}</TableCell>
              <TableCell>{this.props.t('Lisk Address')}</TableCell>
              <TableCell>{this.props.t('Uptime')}</TableCell>
              <TableCell>{this.props.t('Approval')}</TableCell>
            </TableHead>
            {this.props.delegates.map(item => (
              <VotingRow key={item.address} data={item}
                voteToggled={this.props.voteToggled}
                voteStatus={this.props.votes[item.username]}
              />
            ))}
          </Table>
        </div>
        {
          (!this.isInitial && this.props.delegates.length === 0) &&
          <div className='hasPaddingRow empty-message'>{this.props.t('No delegates found')}</div>
        }
        <Waypoint bottomOffset='-80%'
          scrollableAncestor={window}
          key={this.props.delegates.length}
          onEnter={this.loadMore.bind(this)}></Waypoint>
        <VotingBar votes={this.props.votes} />
      </div>
    );
  }
}

export default Voting;
