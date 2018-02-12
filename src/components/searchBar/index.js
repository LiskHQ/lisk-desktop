import React from 'react';
import { withRouter } from 'react-router';
import { translate } from 'react-i18next';
import { FontIcon } from '../fontIcon';
import { visitAndSaveSearch } from './../search/keyAction';
import styles from './searchBar.css';

const getSearchItem = (location) => {
  const regex = new RegExp('/explorer/(?:[^/]*)/?');

  return location.pathname.includes('explorer')
    ? location.pathname.replace(regex, '')
    : '';
};

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = { searchItem: getSearchItem(props.location) };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      this.setState({ searchItem: getSearchItem(nextProps.location) });
    }
  }

  render() {
    return (<div className={styles.searchBar}>
      <FontIcon value='search' className={styles.icon}/>
      <input onKeyUp={(e) => { visitAndSaveSearch(e, this.props.history); }}
        className={styles.input} type="text"
        placeholder={this.props.t('Search for Lisk ID or Transaction ID')}
        value={this.state.searchItem}
        onChange={(e) => { this.setState({ searchItem: e.target.value }); }}
      />
    </div>);
  }
}

export default withRouter(translate()(Search));
