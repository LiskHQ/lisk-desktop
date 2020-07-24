/* istanbul ignore file */
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import BlockDetails from './blockDetails';
import liskService from '../../../../utils/api/lsk/liskService';
import withData from '../../../../utils/withData';

const mapStateToProps = (state, ownProps) => ({
  id: ownProps.match.params.id,
});
const ComposedBlockDetails = compose(
  withRouter,
  connect(mapStateToProps),
  withData({
    blockDetails: {
      apiUtil: liskService.getBlockDetails,
      getApiParams: (state, ownProps) => ({ id: ownProps.id }),
      transformResponse: response => (response.data && response.data[0]),
    },
    blockTransactions: {
      apiUtil: liskService.getBlockTransactions,
      defaultData: [],
      getApiParams: (state, ownProps) => ({ id: ownProps.id }),
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
