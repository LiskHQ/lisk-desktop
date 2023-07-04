import { withTranslation } from 'react-i18next';
import { compose } from 'redux';
import { withRouter } from 'react-router';

import MultisigAccountDetails from '../components/multisigAccountDetails';

export default compose(withRouter, withTranslation())(MultisigAccountDetails);
