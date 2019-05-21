import React from 'react';
import Waypoint from 'react-waypoint';
// import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import styles from './votingHeaderV2.css';
// import { FontIcon } from '../fontIcon';
import voteFilters from './../../constants/voteFilters';
// import { fromRawLsk } from './../../utils/lsk';
// import Fees from './../../constants/fees';
// import routes from './../../constants/routes';
import Piwik from '../../utils/piwik';
import Tabs from '../toolbox/tabs';


class VotingHeadeV2 extends React.Component {
  constructor(props) {
    super();
    this.state = {
      query: '',
      votesList: [],
      activeFilter: voteFilters.all,
    };
    const { t } = props;
    this.filters = [
      {
        name: t('All delegates'),
        value: voteFilters.all,
        className: 'filter-all',
      },
      {
        name: t('Voted'),
        value: voteFilters.voted,
        className: 'filter-voted',
      },
      {
        name: t('Not voted'),
        value: voteFilters.notVoted,
        className: 'filter-not-voted',
      },
    ];

    this.filterVotes = this.filterVotes.bind(this);
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
    Piwik.trackingEvent('VoatingListView', 'button', 'Clear Message');
    this.search({ nativeEvent: { target: { value: '' } } });
  }

  filterVotes(filter) {
    console.log('filter', filter);
    Piwik.trackingEvent('VoatingListView', 'button', 'Filter votes');
    this.setState({ activeFilter: filter.value });
    this.props.setActiveFilter(filter.value);
  }

  markOnOffCanvas(value) {
    this.setState({ headerPosition: value });
  }

  render() {
    const { t } = this.props;
    const { activeFilter } = this.state;

    return (
      <div>
        <header className={`${styles.header} ${styles[this.state.headerPosition]}`}>
          <div>
            <div className={styles.container}>
              <Tabs tabs={this.filters} active={activeFilter} onClick={this.filterVotes} />
              <div className={`${styles.search} ${styles.items} ${styles.filter} search`}>
                <input type='text'
                  name='query'
                  className={`search ${styles.desktopInput} ${this.state.query.length > 0 ? styles.dirty : ''} `}
                  value={this.state.query}
                  onChange={this.search.bind(this)}
                  placeholder={t('Filter by name...')}/>
              </div>
            </div>
          </div>
          <Waypoint onLeave={this.markOnOffCanvas.bind(this, 'offCanvas')} threshold={200}
            onEnter={this.markOnOffCanvas.bind(this, 'onCanvas')} />
        </header>
      </div>
    );
  }
}
export default translate()(VotingHeadeV2);
