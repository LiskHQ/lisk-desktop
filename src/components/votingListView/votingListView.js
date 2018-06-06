import React, { Fragment } from 'react';
import Box from '../box';
import MultiStep from './../multiStep';
import VotingHeader from './votingHeader';
import ListLabels from './listLabels';
import styles from './votingListView.css';
import VoteUrlProcessor from '../voteUrlProcessor';
import voteFilters from './../../constants/voteFilters';
import { parseSearchParams } from '../../utils/searchParams';
import VoteList from './voteList';
import DelegateList from './delegateList';

// Create a new Table component injecting Head and Row
class VotingListView extends React.Component {
  constructor() {
    super();
    this.freezeLoading = false;
    this.isInitial = true;
    this.offset = -1;
    this.query = '';
    this.state = {
      showInfo: true,
      activeFilter: voteFilters.all,
      safariClass: '',
    };
  }

  componentDidMount() {
    if (this.props.serverPublicKey) {
      this.loadVotedDelegates(true);
    }

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
  }

  componentWillUnmount() {
    this.props.delegatesCleared();
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
   * This method is also used in all other methods which load more, search or filter the list.
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

  showInfo() {
    const params = parseSearchParams(this.props.history.location.search);
    return !this.props.nextStepCalled && (params.votes || params.unvotes) && this.state.showInfo;
  }

  closeInfo() {
    this.setState({ showInfo: false });
  }

  render() {
    const filteredList = this.filter(this.props.delegates);
    const {
      showChangeSummery, isDelegate, voteToggled, votes, t,
    } = this.props;
    return (
      <Fragment>
        <VoteUrlProcessor closeInfo={this.closeInfo.bind(this)} show={this.showInfo()} />
        { !this.showInfo() ?
          <Box className={`voting delegate-list-box ${showChangeSummery} ${styles.box}`}>
            <VotingHeader
              setActiveFilter={this.setActiveFilter.bind(this)}
              showChangeSummery={showChangeSummery}
              isDelegate={isDelegate}
              voteToggled={voteToggled}
              search={ value => this.search(value) }
            />
            <section className={`${styles.delegatesList} delegate-list`}>
              <div className={styles.table}>
                <ListLabels t={t} status={showChangeSummery} />
                <MultiStep
                  className={styles.wrapper}>
                  <DelegateList list={filteredList} votes={votes}
                    voteToggled={voteToggled} showChangeSummery={showChangeSummery}
                    safari={this.state.safariClass} loadMore={this.loadMore.bind(this)} />
                  <VoteList votes={votes} showChangeSummery={showChangeSummery}
                    safari={this.state.safariClass} />
                </MultiStep>
              </div>
              {
                (filteredList.length === 0) ?
                  <div className={`empty-message ${styles.emptyMessage}`}>
                    {t(this.getEmptyStateMessage(filteredList))}
                  </div> : null
              }
            </section>
          </Box> : null
        }
      </Fragment>
    );
  }
}

export default VotingListView;
