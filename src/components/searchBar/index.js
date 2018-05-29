import React from 'react';
import { withRouter } from 'react-router';
import { translate } from 'react-i18next';
import { FontIcon } from '../fontIcon';
import { visitAndSaveSearch } from './../search/keyAction';
import AutoSuggest from './../autoSuggest';
import routes from './../../constants/routes';
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

  shouldShowSearchBarOnMobile() {
    const { pathname } = this.props.location;
    return pathname.includes('explorer') && !pathname.includes(`${routes.explorer.path}${routes.search.path}`);
  }

  select() {
    this.searchInput.select();
  }

  render() {
    return (<div className={`${styles.searchBar} search-bar-input ${this.shouldShowSearchBarOnMobile() ? styles.show : null}`}>
      <FontIcon
        onClick={() => { visitAndSaveSearch(this.state.searchItem, this.props.history); }}
        value='search' className={`${styles.icon} search-bar-button`}/>
      {/* <input
        ref={(el) => { this.searchInput = el; }}
        onFocus={this.select.bind(this)}
        onKeyUp={(e) => { visitAndSaveSearchOnEnter(e, this.props.history); }}
        className={`${styles.input}`} type="text"
        placeholder={this.props.t('Search for Lisk ID or Transaction ID')}
        value={this.state.searchItem}
        onChange={(e) => { this.setState({ searchItem: e.target.value }); }}
      /> */}
      <AutoSuggest history={this.props.history} />
    </div>);
  }
}

export default withRouter(translate()(Search));
