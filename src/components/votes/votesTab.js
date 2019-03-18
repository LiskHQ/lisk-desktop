import React from 'react';
import PropTypes from 'prop-types';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { translate } from 'react-i18next';
import BoxV2 from '../boxV2';
import AccountVisual from '../accountVisual';
import VotesTableHeader from './votesTableHeader';
import TableRow from '../toolbox/table/tableRow';
import SpinnerV2 from '../spinnerV2/spinnerV2';
import { InputV2 } from '../toolbox/inputsV2';
import LiskAmount from '../liskAmount';
import routes from '../../constants/routes';
import styles from './votesTab.css';

class VotesTab extends React.Component {
  constructor() {
    super();

    this.state = {
      showing: 30,
      filterValue: '',
      isLoading: false,
      spinnerClass: '',
    };

    this.timeout = null;
    this.onShowMore = this.onShowMore.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.onRowClick = this.onRowClick.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const nextVotes = nextProps.votes.slice(0, this.state.showing).slice(-1);
    if (nextVotes[0] && !nextVotes[0].rank && !this.state.isLoading) {
      this.props.fetchVotedDelegateInfo(nextProps.votes, {
        address: this.props.address,
        showingVotes: this.state.showing,
      });
      this.setState({ isLoading: true });
      this.timeout = setTimeout(() => this.setState({ isLoading: false }), 300);
      return false;
    }
    return true;
  }

  onShowMore() {
    const showing = this.state.showing + 30;
    this.setState({
      showing,
      spinnerClass: styles.bottom,
    });
    this.props.fetchVotedDelegateInfo(this.props.votes, {
      address: this.props.address,
      showingVotes: showing,
    });
  }

  handleFilter({ target }) {
    clearTimeout(this.timeout);
    this.setState({
      filterValue: target.value,
      isLoading: true,
      spinnerClass: styles.top,
    });

    this.timeout = setTimeout(() => {
      this.props.fetchVotedDelegateInfo(this.props.votes, {
        address: this.props.address,
        filter: target.value,
        showingVotes: this.state.showing,
      });
      this.setState({
        isLoading: false,
      });
    }, 300);
  }

  onRowClick(address) {
    const accountAddress = `${routes.accounts.pathPrefix}${routes.accounts.path}/${address}`;
    this.props.history.push(accountAddress);
  }

  /* istanbul ignore next */
  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  render() {
    const { t, votes, loading } = this.props;
    const { filterValue } = this.state;
    const filteredVotes = votes.filter(vote => RegExp(filterValue, 'i').test(vote.username));
    const canLoadMore = filteredVotes.length > this.state.showing;
    const isLoading = loading.length > 0 || this.state.isLoading;

    return (
      <BoxV2 className={`${styles.wrapper}`}>
        <header>
          <h1>{t('Voted delegates')}</h1>
          <div className={`${styles.filterHolder}`}>
            <InputV2
              className={'search'}
              disabled={votes && !votes.length}
              name={'filter'}
              value={filterValue}
              placeholder={t('Filter by name')}
              onChange={this.handleFilter} />
          </div>
        </header>
        <main className={`${styles.results} ${canLoadMore ? styles.hasMore : ''} ${isLoading ? styles.isLoading : ''}`}>
          <VotesTableHeader />
          {
            isLoading ? (
              <div className={styles.loadingOverlay}>
                <SpinnerV2 className={`${styles.loadingSpinner} ${this.state.spinnerClass}`} />
              </div>
            ) : null
          }
          {filteredVotes.length
            ? filteredVotes.slice(0, this.state.showing).map((vote, key) => (
              <TableRow className={`${styles.row} votes-row`} onClick={() => this.onRowClick(vote.address)} key={`row-${key}`}>
                <div className={`${grid['col-sm-1']} ${grid['col-lg-1']}`}>
                  {(vote.rank && +vote.rank < 10 ? `0${vote.rank}` : vote.rank) || '-'}
                </div>
                <div className={`${grid['col-sm-3']} ${grid['col-lg-6']}`}>
                  <div className={`${styles.info}`}>
                    <AccountVisual
                      className={`${styles.avatar}`}
                      address={vote.address}
                      size={36} />
                    <div className={styles.accountInfo}>
                      <span className={`${styles.title}`}>{vote.username}</span>
                      <span>{vote.address}</span>
                    </div>
                  </div>
                </div>
                <div className={`${grid['col-sm-3']} ${grid['col-lg-2']}`}>
                  {vote.rewards
                    ? <span><LiskAmount val={vote.rewards}/> {t('LSK')}</span>
                    : '-'}
                </div>
                <div className={`${grid['col-sm-2']} ${grid['col-lg-1']}`}>
                  {vote.productivity !== undefined ? `${vote.productivity}%` : '-'}
                </div>
                <div className={`${grid['col-sm-3']} ${grid['col-lg-2']}`}>
                  {vote.vote
                    ? <span><LiskAmount val={vote.vote}/> {t('LSK')}</span>
                    : '-'}
                </div>
              </TableRow>
            )) : (
              <p className={`${styles.empty} empty-message`}>
                {filterValue === ''
                  ? t('This wallet doesn’t have any votes')
                  : t('There are no results matching this filter')
                }
              </p>
            )}
          {canLoadMore && <span
            onClick={this.onShowMore}
            className={`${styles.showMore} show-votes`}>{t('Show More')}</span>
          }
        </main>
      </BoxV2>
    );
  }
}

VotesTab.propTypes = {
  address: PropTypes.string,
  votes: PropTypes.arrayOf(PropTypes.shape({
    username: PropTypes.string,
    address: PropTypes.string,
    rank: PropTypes.number,
    productivity: PropTypes.number,
    rewards: PropTypes.string,
    vote: PropTypes.string,
  })),
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  loading: PropTypes.array,
  t: PropTypes.func.isRequired,
  fetchVotedDelegateInfo: PropTypes.func,
};

/* istanbul ignore next */
VotesTab.defaultProps = {
  votes: [],
  loading: [],
};

export default translate()(VotesTab);
