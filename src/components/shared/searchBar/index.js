// istanbul ignore file
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import SearchBar from './searchBar';
import { search } from '../../../utils/api/search';
import withData from '../../../utils/withData';

const mapStateToProps = state => ({
  activeToken: state.settings.token.active,
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
      apiUtil: (network, rest) => {
        const { token, ...params } = rest;
        return search({ network, params }, token);
      },
      defaultData: {
        delegates: [],
        addresses: [],
        transactions: [],
        blocks: [],
      },
      transformResponse: res => ({ ...defaultData, ...res.data }),
    },
  }),
  withTranslation(),
)(SearchBar);
