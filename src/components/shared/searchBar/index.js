// istanbul ignore file
import { withTranslation } from 'react-i18next';
import SearchBar from './searchBar';
import searchAll from '../../../utils/api/search';
import withData from '../../../utils/withData';

export default withData({
  suggestions: {
    apiUtil: searchAll,
    defaultData: {
      delegates: [],
      addresses: [],
      transactions: [],
      blocks: [],
    },
  },
})((withTranslation()(SearchBar)));
