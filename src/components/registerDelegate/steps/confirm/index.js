import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router';
import { getActiveTokenAccount } from '../../../../utils/account';
import Confirm from './confirm';

const mapStateToProps = state => ({
  account: getActiveTokenAccount(state),
  delegate: state.delegate,
});

export default withRouter(connect(mapStateToProps)(translate()(Confirm)));
