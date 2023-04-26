import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import { transactionSigned } from '@transaction/store/actions';
import Summary from './summary';

const dispatchToProps = {
  actionFunction: transactionSigned,
};

export default compose(
  connect(null, dispatchToProps),
  withRouter,
  withTranslation()
)(Summary);
