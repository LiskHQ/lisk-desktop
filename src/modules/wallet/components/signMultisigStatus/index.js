import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import { selectActiveTokenAccount } from 'src/redux/selectors';
import Status from './status';

const mapStateToProps = (state) => ({
  transactions: state.transactions,
  account: selectActiveTokenAccount(state),
});

export default compose(connect(mapStateToProps), withRouter, withTranslation())(Status);
