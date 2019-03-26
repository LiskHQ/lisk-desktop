import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import SeaarchBar from './searchBar';
import { searchSuggestions } from './../../actions/search';
import actionTypes from './../../constants/actions';

const mapStateToProps = state => ({
  suggestions: state.search.suggestions,
  transactions: state.transactions,
});

const mapDispatchToProps = {
  searchSuggestions,
  clearSearchSuggestions: data => ({
    data,
    type: actionTypes.searchClearSuggestions,
  }),
};

export default connect(mapStateToProps, mapDispatchToProps)((translate()(SeaarchBar)));
