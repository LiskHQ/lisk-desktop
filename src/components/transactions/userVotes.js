import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import { FontIcon } from '../fontIcon';
import routes from './../../constants/routes';
import styles from './delegateStatistics.css';

class UserVotes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showVotesNumber: 35,
      loadAllVotes: false,
      votesFilterQuery: '',
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
    const { t } = this.props;
    const votes = this.getFormatedDelegates('votes', 'votesFilterQuery');

    return (
      <div className={`${styles.details} delegate-statistics`}>
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
              {votes && votes
                .slice(0, this.state.showVotesNumber)}
            </div>
            {votes.length > this.state.showVotesNumber
              && this.state.votesFilterQuery === '' ?
              <div onClick={() => { this.showMore('showVotesNumber'); }} className={`${styles.showMore} showMore show-votes`}>
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

export default translate()(UserVotes);

