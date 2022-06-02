/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { selectActiveTokenAccount, selectActiveToken } from '@common/store';
import Form from './form';

const mapStateToProps = state => ({
  account: selectActiveTokenAccount(state),
  bookmarks: state.bookmarks,
  token: selectActiveToken(state),
  network: state.network,
});

export default connect(mapStateToProps)(withTranslation()(Form));
