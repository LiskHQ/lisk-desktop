import React from 'react';
import PropTypes from 'prop-types';
import Box from '../../toolbox/box';
import BoxHeader from '../../toolbox/box/header';
import { Input } from '../../toolbox/inputs';
import routes from '../../../constants/routes';
import styles from './votesTab.css';
import Table from '../../toolbox/table';
import VoteRow from './voteRow';
import header from './votesTableHeader';

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
        <BoxHeader>
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
        </BoxHeader>
        <main className={`${styles.results} ${canLoadMore ? styles.hasMore : ''}`}>
          <Table
            data={filteredVotes.slice(0, this.state.showing)}
            canLoadMore={canLoadMore}
            isLoading={isLoading}
            key="address"
            row={props => <VoteRow {...props} t={t} onRowClick={this.onRowClick.bind(this)} />}
            loadData={this.onShowMore.bind(this)}
            header={header(t)}
          />
        </main>
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
