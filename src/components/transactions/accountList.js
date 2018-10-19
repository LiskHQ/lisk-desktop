import React from 'react';
import { Link } from 'react-router-dom';
import { FontIcon } from '../fontIcon';
import routes from './../../constants/routes';
import styles from './delegateStatistics.css';

class AccountList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showVotesNumber: 35,
      showVotersNumber: 35,
      votersOffset: 100,
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

  /* istanbul ignore next */
  searchMoreVoters() {
    if (this.state.votersOffset < this.props.votersSize) {
      this.props.searchMoreVoters(this.state.votersOffset);
      const votersOffset = this.state.votersOffset + 100;
      this.setState({
        votersOffset,
      });
    }
  }

  /* istanbul ignore next */
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
}

export default AccountList;

