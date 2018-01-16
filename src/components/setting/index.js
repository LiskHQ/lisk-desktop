import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { translate } from 'react-i18next';
import Setting from './setting';

const mapStateToProps = state => ({
  hasSecondPassphrase: state.account.secondSignature,
});

export default withRouter(connect(mapStateToProps)(translate()(Setting)));
