// istanbul ignore file
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { balanceReclaimed } from '@common/store/actions/account';

import Summary from './summary';

const mapStateToProps = state => ({
  account: state.account,
  network: state.network,
});

const dispatchToProps = {
  balanceReclaimed,
};

export default compose(
  connect(mapStateToProps, dispatchToProps),
  withTranslation(),
)(Summary);
