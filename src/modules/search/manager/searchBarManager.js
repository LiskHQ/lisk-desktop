// istanbul ignore file
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { selectActiveToken } from '@common/store';
import withData from 'src/utils/withData';
import { search } from '../api';
import SearchBar from '../components/SearchBar/SearchBar';

const mapStateToProps = state => ({
  activeToken: selectActiveToken(state),
});

const defaultData = {
  delegates: [],
  addresses: [],
  transactions: [],
  blocks: [],
};

export default compose(
  withRouter,
  connect(mapStateToProps),
  withData({
    suggestions: {
      apiUtil: (network, params) =>
        search({ network, params }),
      defaultData,
      transformResponse: res => ({ ...defaultData, ...res.data }),
    },
  }),
  withTranslation(),
)(SearchBar);
