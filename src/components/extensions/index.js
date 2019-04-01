/* istanbul ignore file */
import { withRouter } from 'react-router';
import { translate } from 'react-i18next';
import Extensions from './extensions';

export default translate()(withRouter(Extensions));

