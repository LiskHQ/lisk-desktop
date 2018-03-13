import React from 'react';
import Waypoint from 'react-waypoint';
import { translate } from 'react-i18next';
import styles from './votingHeader.css';
import { FontIcon } from '../fontIcon';
import voteFilters from './../../constants/voteFilters';

export class VotingHeaderRaw extends React.Component {
  constructor() {
    super();
    this.state = {
      query: '',
      votesList: [],
      activeFilter: voteFilters.all,
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
        className: 'filter-voted',
      },
      {
        name: this.props.t('Not voted'),
        value: voteFilters.notVoted,
        className: 'filter-not-voted',
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

  shouldShowEmptyState() {
    return this.props.transactions.length === 0 &&
      (!this.props.activeFilter || this.props.activeFilter === voteFilters.all);
  }

  filterVotes(filter) {
    this.setState({ activeFilter: filter.value });
    this.props.setActiveFilter(filter.value);
  }

  markOnOffCanvas(value) {
    this.setState({ headerPosition: value });
  }

  render() {
    const { t } = this.props;
    const titleDesktop = this.props.showChangeSummery ? 'Your selection' : 'Delegate List';
    const titleMobile = this.props.showChangeSummery ? 'Your selection' : 'Voting';
    return (
      <header className={`${styles.header} ${styles[this.state.headerPosition]}`}>
        <div>
          <h2 className={styles.desktopTitle}>{t(titleDesktop)}</h2>
          <h2 className={styles.mobileTitle}>{t(titleMobile)}</h2>
        </div>
        <div>
          <ul className={styles.filters}>
            {this.filters.map((filter, i) => (
              <li key={i} className={`transaction-filter-item ${filter.className} ${styles.filter} ${(this.state.activeFilter === filter.value) ? styles.active : ''}`}
                onClick={this.filterVotes.bind(this, filter)}>
                {filter.name}
              </li>
            ))}
            <li className={`${styles.search} ${styles.filter} search`}>
              <FontIcon className={styles.search} value='search' id='searchIcon'/>
              <input type='text'
                name='query'
                className={`search ${styles.desktopInput} ${this.state.query.length > 0 ? styles.dirty : ''} `}
                value={this.state.query}
                onChange={this.search.bind(this)}
                placeholder={t('Search for a delegate')}/>
              <input type='text'
                name='query'
                className={`${styles.mobileInput} ${this.state.query.length > 0 ? styles.dirty : ''} `}
                value={this.state.query}
                onChange={this.search.bind(this)}
                placeholder={t('Search')}/>
              <FontIcon id='cleanIcon' className={styles.clean} value='close' onClick={ this.clearSearch.bind(this) }/>
            </li>
          </ul>
        </div>
        <Waypoint onLeave={this.markOnOffCanvas.bind(this, 'offCanvas')} threshold={200}
          onEnter={this.markOnOffCanvas.bind(this, 'onCanvas')} />
      </header>
    );
  }
}
export default translate()(VotingHeaderRaw);
