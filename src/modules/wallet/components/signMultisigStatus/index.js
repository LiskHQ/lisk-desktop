import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import { selectActiveToken, selectActiveTokenAccount } from 'src/redux/selectors';
import Status from './status';

const mapStateToProps = (state) => ({
  transactions: state.transactions,
  account: selectActiveTokenAccount(state),
  bookmarks: state.bookmarks,
  token: selectActiveToken(state),
});

export default compose(connect(mapStateToProps), withRouter, withTranslation())(Status);
