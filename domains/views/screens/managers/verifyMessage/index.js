/* istanbul ignore file */
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import VerifyMessage from './verifyMessage';

export default compose(
  withRouter,
  withTranslation(),
)(VerifyMessage);
