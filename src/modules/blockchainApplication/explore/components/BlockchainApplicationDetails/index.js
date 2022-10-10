/* istanbul ignore file */
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import BlockchainApplicationDetails from './BlockchainApplicationDetails';

export default compose(withRouter)(BlockchainApplicationDetails);
