/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { dynamicFeesRetrieved } from '../../../../../actions/service';
import { getActiveTokenAccount } from '../../../../../utils/account';
import Form from './form';

const mapStateToProps = state => ({
  account: getActiveTokenAccount(state),
  bookmarks: state.bookmarks,
  token: state.settings.token && state.settings.token.active,
  dynamicFees: state.service.dynamicFees,
  networkConfig: state.network,
});

const mapDispatchToProps = {
  dynamicFeesRetrieved,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Form));
