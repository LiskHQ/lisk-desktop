import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { translate } from 'react-i18next';
import { searchSuggestions } from './../../actions/search';
import actionTypes from './../../constants/actions';
import AutoSuggest from './../autoSuggest';
import styles from './searchBar.css';

class Search extends React.Component {
  render() {
    return (<div className={`${styles.searchBar} ${styles.show} search-bar-input`}>
      <AutoSuggest
        history={this.props.history}
        t={this.props.t}
        results={this.props.suggestions}
        activePeer={this.props.activePeer}
        searchClearSuggestions={this.props.searchClearSuggestions}
        searchSuggestions={this.props.searchSuggestions}
      />
    </div>);
  }
}

const mapStateToProps = state => ({
  suggestions: state.search.suggestions,
  activePeer: state.peers.data,
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
