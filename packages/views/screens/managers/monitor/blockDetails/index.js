/* istanbul ignore file */
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { getBlock } from '@common/utilities/api/block';
import { getTransactions } from '@common/utilities/api/transaction';
import withData from '@common/utilities/withData';
import { selectSearchParamValue } from '@common/utilities/searchParams';
import { tokenMap } from '@common/configuration';
import BlockDetails from './blockDetails';

const mapStateToProps = (state, ownProps) => ({
  id: selectSearchParamValue(ownProps.history.location.search, 'id'),
  height: selectSearchParamValue(ownProps.history.location.search, 'height'),
  currentHeight: state.blocks.latestBlocks.length ? state.blocks.latestBlocks[0].height : 0,
});
const ComposedBlockDetails = compose(
  withRouter,
  connect(mapStateToProps),
  withData({
    blockDetails: {
      apiUtil: (network, params) => getBlock({ network, params }),
      getApiParams: (_, ownProps) => ({ blockId: ownProps.id, height: ownProps.height }),
      transformResponse: response => (response.data && response.data[0]),
    },
    blockTransactions: {
      apiUtil: (network, params) => getTransactions({ network, params }, tokenMap.LSK.key),
      defaultData: [],
      getApiParams: (_, ownProps) => {
        if (ownProps.id) return { blockId: ownProps.id };
        return { height: ownProps.height };
      },
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
