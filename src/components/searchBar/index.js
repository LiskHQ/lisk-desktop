import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { translate } from 'react-i18next';
import { searchSuggestions } from './../../actions/search';
import actionTypes from './../../constants/actions';
import AutoSuggest from './../autoSuggest';
import styles from './searchBar.css';

class Search extends React.Component {
  shouldShowSearchBarOnMobile() {
    const { pathname } = this.props.location;
    return pathname.includes('explorer');
  }

  render() {
    return (<div className={`${styles.searchBar} searchBar search-bar-input ${this.shouldShowSearchBarOnMobile() ? styles.show : ''}`}>
      <AutoSuggest
        history={this.props.history}
        t={this.props.t}
        results={this.props.suggestions}
        searchClearSuggestions={this.props.searchClearSuggestions}
        searchSuggestions={this.props.searchSuggestions}
      />
    </div>);
  }
}

const mapStateToProps = state => ({
  suggestions: state.search.suggestions,
});
/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  searchSuggestions: data => dispatch(searchSuggestions(data)),
  searchClearSuggestions: data => dispatch({
    data,
    type: actionTypes.searchClearSuggestions,
  }),
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(Search)));
