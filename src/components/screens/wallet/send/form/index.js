/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { getActiveTokenAccount } from '../../../../../utils/account';
import Form from './form';

const mapStateToProps = state => ({
  account: getActiveTokenAccount(state),
  bookmarks: state.bookmarks,
  token: state.settings.token && state.settings.token.active,
  networkConfig: state.network,
});

export default connect(mapStateToProps)(withTranslation()(Form));
