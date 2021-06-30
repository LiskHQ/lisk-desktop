// istanbul ignore file
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { actionTypes } from '@constants';
import { getActiveTokenAccount } from '../../../../utils/account';

import Summary from './summary';

const mapStateToProps = state => ({
  account: getActiveTokenAccount(state),
  network: state.network,
});

const mapDispatchToProps = dispatch => ({
  transactionCreatedSuccess: (data) => {
    dispatch({
      type: actionTypes.transactionCreatedSuccess,
      data,
    });
  },
  transactionSignError: (error) => {
    dispatch({
      type: actionTypes.transactionSignError,
      error,
    });
  },
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation(),
)(Summary);
