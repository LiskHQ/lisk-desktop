/* istanbul ignore file */
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import RegisterValidator from '../components/RegisterValidatorView';

export default withRouter(withTranslation()(RegisterValidator));
