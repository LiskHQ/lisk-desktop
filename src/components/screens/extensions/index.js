/* istanbul ignore file */
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import Extensions from './extensions';

export default withTranslation()(withRouter(Extensions));
