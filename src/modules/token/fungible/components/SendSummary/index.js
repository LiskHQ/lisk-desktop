/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import { selectActiveToken } from 'src/redux/selectors';
import { resetTransactionResult } from 'src/redux/actions';
import { tokensTransferred } from '../../store/actions';
import Summary from './Summary';

const mapStateToProps = (state) => ({
  transactions: state.transactions,
  token: selectActiveToken(state),
});

const mapDispatchToProps = {
  resetTransactionResult,
  tokensTransferred,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Summary));
