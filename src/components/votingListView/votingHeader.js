import React from 'react';
import Waypoint from 'react-waypoint';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import styles from './votingHeader.css';
import { FontIcon } from '../fontIcon';
import voteFilters from './../../constants/voteFilters';
import { fromRawLsk } from './../../utils/lsk';
import Fees from './../../constants/fees';
import routes from './../../constants/routes';


class VotingHeader extends React.Component {
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

  filterVotes(filter) {
    this.setState({ activeFilter: filter.value });
    this.props.setActiveFilter(filter.value);
  }

  markOnOffCanvas(value) {
    this.setState({ headerPosition: value });
  }

  render() {
    const { t, isDelegate } = this.props;
    const selectionTitle = t('Your selection');
    const delegateTitle = t('Delegate List');
    const votingTitle = t('Voting');
    const titleDesktop = this.props.showChangeSummery ? selectionTitle : delegateTitle;
    const titleMobile = this.props.showChangeSummery ? selectionTitle : votingTitle;
    return (
      <header className={`${styles.header} ${styles[this.state.headerPosition]}`}>
        <div>
          <h2 className={styles.desktopTitle}>{titleDesktop}</h2>
          <h2 className={styles.mobileTitle}>{titleMobile}</h2>
        </div>
        {!isDelegate ?
          <Link to={`${routes.registerDelegate.path}`} className={`${styles.link} ${styles.registerLink} register-delegate`}>
            {t('Become a delegate (Fee: {{fee}} LSK)', { fee: fromRawLsk(Fees.registerDelegate) })}
            <FontIcon value='arrow-right'/>
          </Link> : null
        }
        <div>
          <ul className={`${styles.filters} ${this.props.showChangeSummery ? styles.disabled : ''}`}>
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
              <FontIcon
                id='cleanIcon'
                className={`${styles.clean} clean-icon`}
                value='close'
                onClick={ this.clearSearch.bind(this) }/>
            </li>
          </ul>
        </div>
        <Waypoint onLeave={this.markOnOffCanvas.bind(this, 'offCanvas')} threshold={200}
          onEnter={this.markOnOffCanvas.bind(this, 'onCanvas')} />
      </header>
    );
  }
}
export default translate()(VotingHeader);
