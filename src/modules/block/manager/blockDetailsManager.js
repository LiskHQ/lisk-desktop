/* istanbul ignore file */
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { getBlock } from '@block/utils';
import withData from 'src/utils/withData';
import { selectSearchParamValue } from 'src/utils/searchParams';
import BlockDetails from '../components/blockDetails';

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
  }),
  withTranslation(),
)(BlockDetails);

export default ComposedBlockDetails;
