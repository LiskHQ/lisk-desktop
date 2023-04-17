import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import Summary from './summary';

export default compose(
  withRouter,
  withTranslation()
)(Summary);
