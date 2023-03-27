/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { selectActiveTokenAccount, selectActiveToken } from 'src/redux/selectors';
import SendForm from './SendForm';

const mapStateToProps = (state) => ({
  account: selectActiveTokenAccount(state),
  bookmarks: state.bookmarks,
  token: selectActiveToken(state),
});

export default connect(mapStateToProps)(withTranslation()(SendForm));
