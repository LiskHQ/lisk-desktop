/* istanbul ignore file */
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import registerDelegate from '../components/registerDelegateView';

export default withRouter(withTranslation()(registerDelegate));
