/* istanbul ignore file */
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import VerifyMessageView from '../components/verifyMessageView';

export default compose(withRouter, withTranslation())(VerifyMessageView);
