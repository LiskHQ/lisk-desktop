import React from 'react';
import PropTypes from 'prop-types';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Box from '../toolbox/box';
import AccountVisual from '../accountVisual';
import VotesTableHeader from './votesTableHeader';
import TableRow from '../toolbox/table/tableRow';
import { Input } from '../toolbox/inputs';
import LiskAmount from '../liskAmount';
import routes from '../../constants/routes';
import styles from './votesTab.css';
import { formatAmountBasedOnLocale } from '../../utils/formattedNumber';

class VotesTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      votes: [],
      showing: 30,
      filterValue: '',
      isLoading: false,
    };

    this.timeout = null;
    this.onShowMore = this.onShowMore.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.onRowClick = this.onRowClick.bind(this);
  }

  componentDidMount() {
    this.props.votes.loadData({ address: this.props.address });
    this.props.delegates.loadData({ offset: 0, limit: 101 });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.address !== this.props.address) {
      this.props.votes.loadData({ address: this.props.address });
      this.fetchDelegateWhileNeeded();
    }

    const prevDelegates = Object.keys(prevProps.delegates.data);
    const delegates = Object.keys(this.props.delegates.data);
    if (
      prevProps.votes.data.length !== this.props.votes.data.length
      || prevDelegates.length !== delegates.length
      || prevState.showing !== this.state.showing
      || prevState.filterValue !== this.state.filterValue
    ) {
      this.fetchDelegateWhileNeeded();
    }
  }

  fetchDelegateWhileNeeded() {
    const { filterValue } = this.state;
    const delegates = this.props.delegates.data;
    const filteredVotes = this.props.votes.data.filter(vote => RegExp(filterValue, 'i').test(vote.username));
    const votes = filteredVotes.map((vote) => {
      const delegate = delegates[vote.username] || {};
      return { ...vote, ...delegate };
    }).sort((a, b) => {
      if (!a.rank && !b.rank) return 0;
      if (!a.rank || +a.rank > +b.rank) return 1;
      return -1;
    });
    if (votes.length && !(votes.slice(0, this.state.showing).slice(-1)[0] || {}).rank) {
      const offset = Object.keys(delegates).length;
      this.props.delegates.loadData({ offset, limit: 101 });
    }
    this.setState({ votes });
  }

  onShowMore() {
    this.setState(state => ({
      showing: state.showing + 30,
    }));
  }

  handleFilter({ target }) {
    clearTimeout(this.timeout);
    this.setState({
      filterValue: target.value,
      isLoading: true,
    });

    this.timeout = setTimeout(() => {
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
    const { t, delegates, votes } = this.props;
    const { filterValue, votes: mergedVotes } = this.state;
    const filteredVotes = mergedVotes.filter(vote => RegExp(filterValue, 'i').test(vote.username));
    const canLoadMore = filteredVotes.length > this.state.showing;
    const isLoading = this.state.isLoading || delegates.isLoading || votes.isLoading;

    return (
      <Box main isLoading={isLoading} className={`${styles.wrapper}`}>
        <Box.Header>
          <h1>{t('Voted delegates')}</h1>
          <div className={`${styles.filterHolder}`}>
            <Input
              className="search"
              disabled={mergedVotes && !votes.data.length}
              name="filter"
              value={filterValue}
              placeholder={t('Filter by name')}
              onChange={this.handleFilter}
              size="xs"
            />
          </div>
        </Box.Header>
        <main className={`${styles.results} ${canLoadMore ? styles.hasMore : ''}`}>
          <VotesTableHeader t={t} />
          {filteredVotes.length
            ? filteredVotes.slice(0, this.state.showing).map(vote => (
              <TableRow className={`${styles.row} vote-row`} onClick={() => this.onRowClick(vote.address)} key={vote.address}>
                <div className={`${grid['col-sm-1']} ${grid['col-lg-1']}`}>
                  {(vote.rank && +vote.rank < 10 ? `0${vote.rank}` : vote.rank) || '-'}
                </div>
                <div className={`${grid['col-sm-3']} ${grid['col-lg-6']}`}>
                  <div className={`${styles.info}`}>
                    <AccountVisual
                      className={`${styles.avatar}`}
                      address={vote.address}
                      size={36}
                    />
                    <div className={styles.accountInfo}>
                      <span className={`${styles.title} vote-username`}>{vote.username}</span>
                      <span>{vote.address}</span>
                    </div>
                  </div>
                </div>
                <div className={`${grid['col-sm-2']} ${grid['col-lg-2']}`}>
                  {vote.rewards
                    ? (
                      <span>
                        <LiskAmount val={vote.rewards} />
                        {' '}
                        {t('LSK')}
                      </span>
                    )
                    : '-'}
                </div>
                <div className={`${grid['col-sm-2']} ${grid['col-lg-1']}`}>
                  {vote.productivity !== undefined
                    ? `${formatAmountBasedOnLocale({ value: vote.productivity })}%`
                    : '-'
                  }
                </div>
                <div className={`${grid['col-sm-4']} ${grid['col-lg-2']}`}>
                  {vote.vote
                    ? (
                      <span className={styles.votes}>
                        <LiskAmount val={vote.vote} />
                        {' '}
                        {t('LSK')}
                      </span>
                    )
                    : '-'}
                </div>
              </TableRow>
            )) : (
              <p className={`${styles.empty} empty-message`}>
                {filterValue === ''
                  ? t('This account doesn’t have any votes.')
                  : t('There are no results matching this filter.')
                }
              </p>
            )}
        </main>
        {canLoadMore && (
          <Box.FooterButton onClick={this.onShowMore} className="show-votes">
            {t('Load more')}
          </Box.FooterButton>
        )
        }
      </Box>
    );
  }
}

VotesTab.propTypes = {
  address: PropTypes.string,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  loading: PropTypes.array,
  t: PropTypes.func.isRequired,
};

VotesTab.defaultProps = {
  loading: [],
};

export default VotesTab;
