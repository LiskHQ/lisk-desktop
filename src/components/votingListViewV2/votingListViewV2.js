import React from 'react';
import VotingHeaderV2 from './votingHeaderV2';
import styles from './votingListViewV2.css';
import voteFilters from './../../constants/voteFilters';
import DelegateListV2 from './delegateListV2';
import ProgressBar from '../toolbox/progressBar/progressBar';
import Tooltip from '../toolbox/tooltip/tooltip';
import { getTotalVotesCount } from './../../utils/voting';
import BoxV2 from '../boxV2';

// Create a new Table component injecting Head and Row
class VotingListViewV2 extends React.Component {
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
    this.loadDelegates('', true);
    if (this.props.serverPublicKey) {
      this.loadVotedDelegates();
    }
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
      this.props.votesFetched({
        address: this.props.address,
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
    this.loadDelegates(query, true, 0);
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
  loadDelegates(q = '', refresh, offset = 0) {
    this.freezeLoading = true;

    this.props.delegatesFetched({
      offset,
      q,
      refresh,
    });
  }

  /**
   * load more data when scroll bar reaches end of the page
   */
  loadMore() {
    const list = this.filter(this.props.delegates);
    this.loadDelegates(this.query, false, list[list.length - 1].rank);
  }

  setActiveFilter(filter) {
    setTimeout(() => {
      this.setState({ isLoading: false });
    }, 1000);
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
    } else if (this.state.activeFilter === voteFilters.voted &&
      getTotalVotesCount(this.props.votes) === 0) {
      message = t('You have not voted yet.');
    } else if (this.query !== '' && Object.keys(filteredList).length === 0) {
      message = t('No search result in given criteria.');
    }

    return message;
  }

  render() {
    const filteredList = this.filter(this.props.delegates);
    const {
      showChangeSummery, isDelegate, voteToggled, votes, t, votingModeEnabled,
    } = this.props;
    return (
      <BoxV2>
        <header>
          <VotingHeaderV2
            t={t}
            account={this.props.account}
            setActiveFilter={this.setActiveFilter.bind(this)}
            showChangeSummery={showChangeSummery}
            isDelegate={isDelegate}
            voteToggled={voteToggled}
            search={ value => this.search(value) }
          />
        </header>
        {this.state.isLoading ? (
          <div className={styles.loadingOverlay}>
            <ProgressBar type="linear" mode="indeterminate" theme={styles} className={'loading'}/>
          </div>
        ) : null}
        {votingModeEnabled && getTotalVotesCount(votes) === 0 ?
          <Tooltip
            infoIconClassName={styles.infoIconClassName}
            tooltipClassName={styles.tooltipClassName}
            className={styles.selectingDelegates}
            showTooltip={true}
            title={t('Selecting Delegates')} >
            <p>{t('Start by Selecting the delegates you’d like to vote for.')}</p>
          </Tooltip> :
        null}
          <div className={styles.wrapper}>
            <DelegateListV2 t={t} list={filteredList} votes={votes}
              votingModeEnabled={votingModeEnabled}
              voteToggled={voteToggled} showChangeSummery={showChangeSummery}
              safari={this.state.safariClass} loadMore={this.loadMore.bind(this)} />
          </div>
          {
            (filteredList.length === 0) ?
              <div className={`empty-message ${styles.emptyMessage}`}>
                {t(this.getEmptyStateMessage(filteredList))}
              </div> : null
          }
    </BoxV2>
    );
  }
}

export default VotingListViewV2;
