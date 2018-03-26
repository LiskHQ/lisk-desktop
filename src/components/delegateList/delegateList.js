import React from 'react';
import Waypoint from 'react-waypoint';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Box from '../box';
import Header from './votingHeader';
import VotingRow from './votingRow';
import styles from './delegateList.css';
import voteFilters from './../../constants/voteFilters';

// Create a new Table component injecting Head and Row
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
      safariClass: '',
    };
  }

  componentDidMount() {
    this.loadVotedDelegates(true);
    if (navigator.userAgent) {
      const agent = navigator.userAgent;
      if (agent.indexOf('Safari') > 0 && agent.indexOf('Chrome') === -1) {
        this.setState({ safariClass: styles.safariHack });
      }
    }
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
        activeFilter: voteFilters.all,
        showChangeSummery: nextProps.showChangeSummery,
      });
    }
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
    if (!this.state.showChangeSummery && !this.freezeLoading
      && this.props.totalDelegates > this.offset) {
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
      case voteFilters.voted:
        return delegates.filter(delegate =>
          (votes[delegate.username] && votes[delegate.username].confirmed));
      case voteFilters.notVoted:
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
    } else if (this.state.activeFilter === voteFilters.voted &&
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
        className={this.state.safariClass}
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
      <Box className={`voting delegate-list-box ${showChangeSummery} ${styles.box}`}>
        <Header
          setActiveFilter={this.setActiveFilter.bind(this)}
          showChangeSummery={this.state.showChangeSummery}
          voteToggled={this.props.voteToggled}
          search={ value => this.search(value) }
        />
        <section className={`${styles.delegatesList} delegate-list`}>
          <div className={styles.table}>
            <ul className={`${styles.tableHead} ${grid.row}`}>
              <li className={`${grid['col-md-1']} ${grid['col-xs-2']} ${styles.leftText}`}>{this.props.t('Vote', { context: 'verb' })}</li>
              <li className={`${grid['col-md-1']} ${grid['col-xs-2']}`}>{this.props.t('Rank')}</li>
              <li className={`${grid['col-md-3']} ${grid['col-xs-5']}`}>{this.props.t('Name')}</li>
              <li className={`${grid['col-md-5']}`}>{this.props.t('Lisk ID')}</li>
              <li className={`${grid['col-md-2']} ${grid['col-xs-3']} ${styles.productivity}`}>{this.props.t('Productivity')}</li>
            </ul>
            { this.getList(filteredList) }
          </div>
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
