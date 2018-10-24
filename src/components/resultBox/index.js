import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import ResultBox from './resultBox';

const mapStateToProps = state => ({
  followedAccounts: state.followedAccounts ? state.followedAccounts.accounts : [],
});

export default withRouter(connect(mapStateToProps)(translate()(ResultBox)));
