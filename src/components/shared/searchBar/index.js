// istanbul ignore file
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import SearchBar from './searchBar';
import { search } from '../../../utils/api/search';
import withData from '../../../utils/withData';

export default withRouter(withData({
  suggestions: {
    apiUtil: search,
    defaultData: {
      delegates: [],
      addresses: [],
      transactions: [],
      blocks: [],
    },
  },
})((withTranslation()(SearchBar))));
