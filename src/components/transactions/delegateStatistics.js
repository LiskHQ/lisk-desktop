import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import { FontIcon } from '../fontIcon';
import routes from './../../constants/routes';
import styles from './delegateStatistics.css';

class DelegateStatistics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showVotesNumber: 35,
      showVotersNumber: 35,
      loadAllVotes: false,
      votersFilterQuery: '',
      votesFilterQuery: '',
      votersSize: (props.voters && props.voters.length) || 0,
      votesSize: (props.votes && props.votes.length) || 0,
    };
  }

  showMore(name, amount = 100) {
    const newAmount = this.state[name] + amount;
    this.setState({ [name]: newAmount });
  }

  filterList(data, filterQuery) {
    if (this.state[filterQuery] !== '') {
      data = data.filter((obj) => {
        const name = obj.props.children.trim();
        return name.includes(this.state[filterQuery]);
      });
    }
    return data;
  }

  getFormatedDelegates(dataName, filterQuery) {
    const data = this.props[dataName] ? this.props[dataName].map((user, key) => (
      <Link className={`${styles.addressLink} ${styles.clickable} voter-address ${filterQuery}-row`}
        to={`${routes.explorer.path}${routes.accounts.path}/${user.address}`}
        key={`${key}-${dataName}`}>
        {`${user.username || user.address} `}
      </Link>
    )) : [];

    return this.filterList(data, filterQuery);
  }

  search(filterName, e) {
    const { value } = e.target;
    this.setState({
      [filterName]: value,
    });
  }

  clearSearch(filterQuery) {
    this.search(filterQuery, { target: { value: '' } });
  }

  renderSearchFilter(filterQuery, placeholder) {
    return (
      <div className={`${styles.search} ${styles.filter} search ${filterQuery}`}>
        <FontIcon className={styles.search} value='search' id='searchIcon'/>
        <input type='text'
          name='query'
          className={`search ${styles.desktopInput} ${this.state[filterQuery].length > 0 ? styles.dirty : ''} `}
          value={this.state[filterQuery]}
          onChange={this.search.bind(this, filterQuery)}
          placeholder={placeholder}/>
        <input type='text'
          name='query'
          className={`${styles.mobileInput} ${this.state[filterQuery].length > 0 ? styles.dirty : ''} `}
          value={this.state[filterQuery]}
          onChange={this.search.bind(this, filterQuery)}
          placeholder={this.props.t('Filter')}/>
        <FontIcon
          id='cleanIcon'
          className={`${styles.clean} clean-icon`}
          value='close'
          onClick={ this.clearSearch.bind(this, filterQuery) }/>
      </div>
    );
  }

  render() {
    const { delegate, t } = this.props;
    const votesInterspered = this.getFormatedDelegates('votes', 'votesFilterQuery');
    const votersInterspered = this.getFormatedDelegates('voters', 'votersFilterQuery');

    let status = '';
    if (delegate && delegate.rank) {
      status = delegate.rank < 101 ? this.props.t('Active') : this.props.t('Standby');
    }

    const missed = this.props.t('missed');
    return (
      <div className={`${styles.details} delegate-statistics`}>
        <div className={`transactions-detail-view ${grid.row} ${grid['between-md']} ${grid['between-sm']} ${styles.row}`}>
          <div className={`${grid['col-xs-12']} ${grid['col-sm-4']} ${grid['col-md-4']} productivity`}>
            <div className={styles.label}>{this.props.t('Uptime')}</div>
            <div className={styles.value}>{delegate && delegate.productivity}%</div>
          </div>
          <div className={`${grid['col-xs-12']} ${grid['col-sm-4']} ${grid['col-md-4']} rank`}>
            <div className={styles.label}>{this.props.t('Rank / Status')}</div>
            <div className={styles.value}>{delegate && delegate.rank} / {status}</div>
          </div>
          <div className={`${grid['col-xs-12']} ${grid['col-sm-4']} ${grid['col-md-4']} approval`}>
            <div className={styles.label}>{this.props.t('Approval')}</div>
            <div className={styles.value}>{delegate && delegate.approval}%</div>
          </div>
        </div>
        <div className={`transactions-detail-view ${grid.row} ${grid['between-md']} ${grid['between-sm']} ${styles.row} vote`}>
          <div className={`${grid['col-xs-12']} ${grid['col-sm-4']} ${grid['col-md-4']}`}>
            <div className={styles.label}>{this.props.t('Vote weight')}</div>
            <div className={styles.value}>{delegate && delegate.vote}</div>
          </div>
          <div className={`${grid['col-xs-12']} ${grid['col-sm-8']} ${grid['col-md-8']} blocks`}>
            <div className={styles.label}>{this.props.t('Blocks')}</div>
            <div className={styles.value}>
              {`${delegate && delegate.producedblocks} (${delegate && delegate.missedblocks} ${missed})`}
            </div>
          </div>
        </div>
        <div className={`transactions-detail-view ${grid.row} ${grid['between-md']} ${grid['between-sm']} ${styles.row} votes`}>
          <div className={`${grid['col-xs-12']} ${grid['col-sm-12']} ${grid['col-md-12']}`}>
            <div className={styles.label}>
              <div className='votes-value'>
                {this.props.t('Votes of an account')}
                {` (${this.state.votesSize})`}
              </div>
              {this.renderSearchFilter('votesFilterQuery', t('Filter votes'))}
            </div>
            <div className={styles.value}>
              {votesInterspered && votesInterspered
                .slice(0, this.state.showVotesNumber)}
            </div>
            {votesInterspered.length > this.state.showVotesNumber
              && this.state.votesFilterQuery === '' ?
              <div onClick={() => { this.showMore('showVotesNumber'); }} className={`${styles.showMore} showMore show-votes`}>
                <FontIcon className={styles.arrowDown} value='arrow-down'/>
                {this.props.t('Show more')}
              </div> : ''
            }
          </div>
        </div>
        <div className={`transactions-detail-view ${grid.row} ${grid['between-md']} ${grid['between-sm']} ${styles.row} voters`}>
          <div className={`${grid['col-xs-12']} ${grid['col-sm-12']} ${grid['col-md-12']}`}>
            <div className={styles.label}>
              <div className='voters-value'>
                {this.props.t('Who voted for a delegate')}
                {` (${this.state.votersSize})`}
              </div>
              {this.renderSearchFilter('votersFilterQuery', t('Filter voters'))}
            </div>
            <div className={styles.value}>
              {votersInterspered && votersInterspered
                .slice(0, this.state.showVotersNumber)}
            </div>
            {votersInterspered.length > this.state.showVotersNumber ?
              <div onClick={() => { this.showMore('showVotersNumber'); }} className={`${styles.showMore} showMore  show-voters`}>
                <FontIcon className={styles.arrowDown} value='arrow-down'/>
                {this.props.t('Show more')}
              </div> : ''
            }
          </div>
        </div>
      </div>
    );
  }
}

export default translate()(DelegateStatistics);

