/* istanbul ignore file */
import { compose } from 'redux';
import { withRouter } from 'react-router';
import BlockchainApplicationAddSuccess from './BlockchainApplicationAddSuccess';

export default compose(
  withRouter,
)(BlockchainApplicationAddSuccess);
