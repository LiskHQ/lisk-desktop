/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router';
import { delegateRegistered } from '../../actions/account';
import { delegatesFetched } from '../../actions/delegate';
import { getActiveTokenAccount } from '../../utils/account';
import DelegateRegistration from './delegateRegistration';

const mapStateToProps = state => ({
  account: getActiveTokenAccount(state),
  delegate: state.delegate,
});

const mapDispatchToProps = {
  delegatesFetched,
  delegateRegistered,
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(DelegateRegistration)));
