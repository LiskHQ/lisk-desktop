/* istanbul ignore file */
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { selectSearchParamValue } from 'src/utils/searchParams';
import BlockDetails from '../components/blockDetails';

const mapStateToProps = (state, ownProps) => ({
  id: selectSearchParamValue(ownProps.history.location.search, 'id'),
  height: selectSearchParamValue(ownProps.history.location.search, 'height'),
});
const ComposedBlockDetails = compose(withRouter, connect(mapStateToProps))(BlockDetails);

export default ComposedBlockDetails;
