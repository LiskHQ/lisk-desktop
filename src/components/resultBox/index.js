import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import actionTypes from '../../constants/actions';
import ResultBox from './resultBox';

const mapStateToProps = state => ({
  followedAccounts: state.followedAccounts ? state.followedAccounts.accounts : [],
});

const mapDispatchToProps = dispatch => ({
  transactionFailedClear: () => dispatch({
    type: actionTypes.transactionFailedClear,
  }),
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(ResultBox)));
