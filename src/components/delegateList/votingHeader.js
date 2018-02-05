import React from 'react';
import { translate } from 'react-i18next';
import styles from './delegateList.css';
import { FontIcon } from '../fontIcon';
import voteFilters from './../../constants/voteFilters';

export class VotingHeaderRaw extends React.Component {
  constructor() {
    super();
    this.state = {
      query: '',
      votesList: [],
      activeFilter: 0,
    };
  }

  componentWillMount() {
    this.filters = [
      {
        name: this.props.t('All'),
        value: voteFilters.all,
        className: 'filter-all',
      },
      {
        name: this.props.t('Voted'),
        value: voteFilters.voted,
        className: 'filter-in',
      },
      {
        name: this.props.t('Not voted'),
        value: voteFilters.notVoted,
        className: 'filter-out',
      },
    ];
  }

  search({ nativeEvent }) {
    const { value } = nativeEvent.target;
    this.setState({
      query: value,
    });

    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      if (value === this.state.query) {
        this.props.search(value);
      }
    }, 250);
  }

  clearSearch() {
    this.search({ nativeEvent: { target: { value: '' } } });
  }

  componentDidUpdate() {
    const { count, votes } = this.props;
    this.canLoadMore = count === null || count > votes.length;
  }

  shouldShowEmptyState() {
    return this.props.transactions.length === 0 &&
      (!this.props.activeFilter || this.props.activeFilter === voteFilters.all);
  }

  filterVotes(filter) {
    this.setState({ activeFilter: filter.value });
    this.props.setActiveFilter(filter.value);
  }

  render() {
    const { t } = this.props;
    const title = this.props.showChangeSummery ? 'Your selection' : 'Delegate List';
    return (
      <header className={`${styles.header}`}>
        <div>
          <h2>{t(title)}</h2>
        </div>
        <div>
          <ul className={styles.filters}>
            {this.filters.map((filter, i) => (
              <li key={i} className={`transaction-filter-item ${filter.className} ${styles.filter} ${(this.state.activeFilter === filter.value) ? styles.active : ''}`}
                onClick={this.filterVotes.bind(this, filter)}>
                {filter.name}
              </li>
            ))}
            <li className={`${styles.search} ${styles.filter}`}>
              <FontIcon className={styles.search} value='search' id='searchIcon'/>
              <input type='text'
                name='query'
                className={`search ${this.state.query.length > 0 ? styles.dirty : ''} `}
                theme={styles}
                value={this.state.query}
                onChange={this.search.bind(this)}
                placeholder={t('Search for a delegate')}/>
              <FontIcon id='cleanIcon' className={styles.clean} value='close' onClick={ this.clearSearch.bind(this) }/>
            </li>
          </ul>
        </div>
      </header>
    );
  }
}
export default translate()(VotingHeaderRaw);
