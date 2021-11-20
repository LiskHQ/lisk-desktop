/* istanbul ignore file */
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import registerDelegate from './registerDelegate';

export default withRouter(withTranslation()(registerDelegate));
