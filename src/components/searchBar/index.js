import React from 'react';
import { withRouter } from 'react-router';
import { translate } from 'react-i18next';
import { FontIcon } from '../fontIcon';
import { visitAndSaveSearch } from './../search/keyAction';
import styles from './searchBar.css';

class Search extends React.Component {
  constructor(props) {
    super(props);
    const regex = new RegExp('/explorer/(?:[^/]*)/?');
    const searchItem = this.props.history.location.pathname.replace(regex, '');
    this.state = { searchItem };
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
