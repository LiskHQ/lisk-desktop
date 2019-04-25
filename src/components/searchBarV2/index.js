// istanbul ignore file
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { searchSuggestions, clearSearchSuggestions } from './../../actions/search';
import SearchBar from './searchBar';

const mapStateToProps = state => ({
  suggestions: state.search.suggestions,
});

const mapDispatchToProps = {
  searchSuggestions,
  clearSearchSuggestions,
};

export default connect(mapStateToProps, mapDispatchToProps)((translate()(SearchBar)));
