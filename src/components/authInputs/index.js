import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import AuthInputs from './authInputs';

const mapStateToProps = state => ({
  account: state.account,
});

export default connect(mapStateToProps)(translate()(AuthInputs));
