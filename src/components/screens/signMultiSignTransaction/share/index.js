import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import Share from './share';

const mapStateToProps = state => ({
  transactions: state.transactions,
});

export default compose(
  connect(mapStateToProps),
  withRouter,
  withTranslation(),
)(Share);
