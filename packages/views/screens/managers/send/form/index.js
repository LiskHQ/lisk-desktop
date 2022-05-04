/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { getActiveTokenAccount } from '@wallet/utils/account';
import Form from './form';

const mapStateToProps = state => ({
  account: getActiveTokenAccount(state),
  bookmarks: state.bookmarks,
  token: state.token && state.token.active,
  network: state.network,
});

export default connect(mapStateToProps)(withTranslation()(Form));
