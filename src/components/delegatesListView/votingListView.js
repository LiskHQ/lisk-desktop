import React from 'react';
import VotingHeader from './votingHeader';
import styles from './votingListView.css';
import voteFilters from '../../constants/voteFilters';
import DelegateList from './delegateList';
import Tooltip from '../toolbox/tooltip/tooltip';
import {
  getTotalVotesCount,
  getPendingVotesList,
  getVotedList,
} from '../../utils/voting';
import Box from '../toolbox/box';

// Create a new Table component injecting Head and Row
class VotingListView extends React.Component {
  constructor() {
    super();
    this.freezeLoading = false;
    this.isInitial = true;
    this.query = '';
    this.state = {
      activeFilter: voteFilters.all,
      safariClass: '',
      isLoading: false,
    };
  }

  componentDidMount() {
    const { votes, account, votingModeEnabled } = this.props;
    if (account.serverPublicKey && !votingModeEnabled && getPendingVotesList(votes).length === 0) {
      this.loadVotedDelegates();
    }
    this.loadDelegates('');
  }

  componentDidUpdate(nextProps) {
    if (this.props.delegates.length < nextProps.delegates.length) {
      this.freezeLoading = false;
      this.isInitial = false;
    }
  }

  loadVotedDelegates() {
    /* istanbul-ignore-else */
    if (!this.freezeLoading) {
      this.props.loadVotes({
        address: this.props.account.address,
      });
    }
  }

  /**
   * Fetches a list of delegates based on the given search phrase
   * @param {string} query - username of a delegate
   */
  search(query) {
    this.query = query;
    this.freezeLoading = false;
    this.loadDelegates(query);
  }

  /**
   * Fetches a list of delegates
   * This method is also used in all other methods which load more, search or filter the list.
   *
   * @method loadDelegates
   * @param {String} query - The search phrase to match with the delegate name
   *  should replace the old delegates list
   * @param {Number} limit - The maximum number of results
   */
  loadDelegates(q = '', offset = 0) {
    this.freezeLoading = true;
    this.setState({ isLoading: true });

    this.props.loadDelegates({
      offset,
      q,
      refresh: offset === 0,
      callback: () => {
        if (this.state.isLoading) {
          this.setState({ isLoading: false });
        }
      },
    });
  }

  loadMore() {
    this.loadDelegates(this.query, this.props.delegates.length);
  }

  setActiveFilter(filter) {
    setTimeout(() => {
      this.setState({ isLoading: false });
    }, 500);
    this.setState({
      activeFilter: filter,
      isLoading: true,
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
    const { t } = this.props;
    let message = '';

    if (!this.isInitial && this.props.delegates.length === 0) {
      message = t('No delegates found.');
    } else if (this.state.activeFilter === voteFilters.voted
      && getTotalVotesCount(this.props.votes) === 0) {
      message = t('You have not voted yet.');
    } else if (this.query !== '' && Object.keys(filteredList).length === 0) {
      message = t('No search results in given criteria.');
    }

    return message;
  }

  render() {
    const {
      voteToggled, votes, t, votingModeEnabled,
      delegates,
    } = this.props;
    const { isLoading } = this.state;
    const filteredList = this.filter(delegates);
    const firstTimeVotingActive = votingModeEnabled && getTotalVotesCount(votes) === 0;
    return (
      <Box isLoading={isLoading}>
        <Box.Header>
          <VotingHeader
            t={t}
            account={this.props.account}
            setActiveFilter={this.setActiveFilter.bind(this)}
            voteToggled={voteToggled}
            search={value => this.search(value)}
          />
        </Box.Header>
        {firstTimeVotingActive
          ? (
            <div className={styles.loadingOverlay}>
              <Tooltip
                styles={{
                  infoIcon: styles.infoIcon,
                  tooltip: styles.tooltipClass,
                }}
                tooltipClassName={styles.tooltipClassName}
                className={styles.selectingDelegates}
                alwaysShow
                title={t('Selecting Delegates')}
              >
                <p>{t('Start by Selecting the delegates you’d like to vote for.')}</p>
              </Tooltip>
            </div>
          )
          : null}
        <DelegateList
          t={t}
          list={filteredList}
          votes={votes}
          firstTimeVotingActive={firstTimeVotingActive}
          votingModeEnabled={votingModeEnabled}
          voteToggled={voteToggled}
          shouldLoadMore={
                filteredList.length > 0
                && (
                  (this.state.activeFilter !== voteFilters.voted
                    && delegates.length % 101 === 0)
                  || (this.state.activeFilter === voteFilters.voted
                    && filteredList.length < getVotedList(votes).length)
                )
              }
          safari={this.state.safariClass}
          loadMore={this.loadMore.bind(this)}
        />
        {
            (filteredList.length === 0)
              ? (
                <Box.EmptyState className={`empty-message ${styles.emptyMessage}`}>
                  {t(this.getEmptyStateMessage(filteredList))}
                </Box.EmptyState>
              ) : null
          }
      </Box>
    );
  }
}

export default VotingListView;
