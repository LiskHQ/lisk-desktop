/* istanbul ignore file */
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import RegisterDelegate from '../components/RegisterDelegateView';

export default withRouter(withTranslation()(RegisterDelegate));
