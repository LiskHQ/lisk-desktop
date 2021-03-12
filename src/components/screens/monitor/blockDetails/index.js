/* istanbul ignore file */
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import BlockDetails from './blockDetails';
import { getBlock } from '../../../../utils/api/block';
import { getTransactions } from '../../../../utils/api/transaction';
import withData from '../../../../utils/withData';
import { selectSearchParamValue } from '../../../../utils/searchParams';
import { tokenMap } from 'constants';

const mapStateToProps = (state, ownProps) => ({
  id: selectSearchParamValue(ownProps.history.location.search, 'id'),
});
const ComposedBlockDetails = compose(
  withRouter,
  connect(mapStateToProps),
  withData({
    blockDetails: {
      apiUtil: (network, params) => getBlock({ network, params }),
      getApiParams: (state, ownProps) => ({ id: ownProps.id }),
      transformResponse: response => (response.data && response.data[0]),
    },
    blockTransactions: {
      apiUtil: (network, params) => getTransactions({ network, params }, tokenMap.LSK.key),
      defaultData: [],
      getApiParams: (state, ownProps) => ({ blockId: ownProps.id }),
      transformResponse: (response, oldData, urlSearchParams) => (
        urlSearchParams.offset
          ? [...oldData, ...response.data.filter(block =>
            !oldData.find(({ id }) => id === block.id))]
          : response.data
      ),
    },
  }),
  withTranslation(),
)(BlockDetails);

export default ComposedBlockDetails;
