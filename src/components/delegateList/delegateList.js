import React from 'react';
import { TABLE } from 'react-toolbox/lib/identifiers';
import { TableHead, TableCell } from 'react-toolbox/lib/table';
import { tableFactory } from 'react-toolbox/lib/table/Table';
import { themr } from 'react-css-themr';
import TableTheme from 'react-toolbox/lib/table/theme.css';
import Waypoint from 'react-waypoint';
import Box from '../box';
import Header from './votingHeader';
import VotingRow from './votingRow';
import styles from './delegateList.css';
import voteFilters from './../../constants/voteFilters';

// Create a new Table component injecting Head and Row
const Table = themr(TABLE, TableTheme)(tableFactory(TableHead, VotingRow));
class DelegateList extends React.Component {
  constructor() {
    super();
    this.freezeLoading = false;
    this.isInitial = true;
    this.offset = -1;
    this.query = '';
    this.state = {
      activeFilter: voteFilters.all,
      showChangeSummery: false,
    };
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

    if (this.props.showChangeSummery !== nextProps.showChangeSummery) {
      this.setState({
        showChangeSummery: nextProps.showChangeSummery,
      });
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

  setActiveFilter(filter) {
    this.setState({
      activeFilter: filter,
    });
  }

  filter(delegates) {
    const { votes } = this.props;
    switch (this.state.activeFilter) {
      case 1:
        return delegates.filter(delegate =>
          (votes[delegate.username] && votes[delegate.username].confirmed));
      case 2:
        return delegates.filter(delegate =>
          (!votes[delegate.username] || !votes[delegate.username].confirmed));
      default:
        return delegates;
    }
  }

  getEmptyStateMessage(filteredList) {
    let message = '';

    if (!this.isInitial && this.props.delegates.length === 0) {
      message = 'No delegates found.';
    } else if (this.state.filter === voteFilters.voted &&
      Object.keys(this.props.votes).length === 0) {
      message = 'You have not voted yet.';
    } else if (this.query !== '' && Object.keys(filteredList).length === 0) {
      message = 'No search result in given criteria.';
    }

    return message;
  }

  getList(filteredList) {
    return filteredList.map(item => (
      <VotingRow key={item.address} data={item}
        voteToggled={this.props.voteToggled}
        voteStatus={this.props.votes[item.username]}
      />
    ));
  }

  render() {
    const showChangeSummery = this.state.showChangeSummery ?
      styles.showChangeSummery : '';
    const filteredList = this.filter(this.props.delegates);
    return (
      <Box className={`voting ${showChangeSummery}`}>
        <Header
          setActiveFilter={this.setActiveFilter.bind(this)}
          showChangeSummery={this.state.showChangeSummery}
          voteToggled={this.props.voteToggled}
          addTransaction={this.props.addTransaction}
          votes={this.props.votes}
          search={ value => this.search(value) }
        />
        <section className={styles.delegatesList}>
          <Table selectable={false} >
            <TableHead displaySelect={false}>
              <TableCell>{this.props.t('Vote', { context: 'verb' })}</TableCell>
              <TableCell>{this.props.t('Rank')}</TableCell>
              <TableCell>{this.props.t('Name')}</TableCell>
              <TableCell>{this.props.t('Lisk ID')}</TableCell>
              <TableCell>{this.props.t('Productivity')}</TableCell>
            </TableHead>
            { this.getList(filteredList) }
          </Table>
          {
            (filteredList.length === 0) ?
              <div className={`empty-message ${styles.emptyMessage}`}>
                {this.props.t(this.getEmptyStateMessage(filteredList))}
              </div> : null
          }
          <Waypoint bottomOffset='-80%'
            key={this.props.delegates.length}
            onEnter={this.loadMore.bind(this)}></Waypoint>
        </section>
      </Box>
    );
  }
}

export default DelegateList;
