import React from 'react';
import { translate } from 'react-i18next';
import voteFilters from './../../constants/voteFilters';
import Piwik from '../../utils/piwik';
import Tabs from '../toolbox/tabs';
import { InputV2 } from '../toolbox/inputsV2';


class VotingHeaderV2 extends React.Component {
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
    const { t } = this.props;
    const { activeFilter } = this.state;

    return (
      <React.Fragment>
        <Tabs tabs={this.filters} active={activeFilter} onClick={this.filterVotes} />
        <span>
          <InputV2
            size='xs'
            className='search'
            value={this.state.query}
            onChange={this.search.bind(this)}
            placeholder={t('Filter by name...')}/>
        </span>
      </React.Fragment>
    );
  }
}
export default translate()(VotingHeaderV2);
