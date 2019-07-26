import React from 'react';
import voteFilters from '../../constants/voteFilters';
import Piwik from '../../utils/piwik';
import Tabs from '../toolbox/tabs';
import { Input } from '../toolbox/inputs';


class VotingHeader extends React.Component {
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

  filterVotes(filter) {
    Piwik.trackingEvent('VoatingListView', 'button', 'Filter votes');
    this.setState({ activeFilter: filter.value });
    this.props.setActiveFilter(filter.value);
  }

  render() {
    const { t, account } = this.props;
    const { activeFilter } = this.state;

    return (
      <React.Fragment>
        { account && account.address
          ? <Tabs tabs={this.filters} active={activeFilter} onClick={this.filterVotes} />
          : <h2>{t('All delegates')}</h2>
        }
        <span>
          <Input
            size="xs"
            className="search"
            value={this.state.query}
            onChange={this.search.bind(this)}
            placeholder={t('Filter by name...')}
          />
        </span>
      </React.Fragment>
    );
  }
}
export default VotingHeader;
