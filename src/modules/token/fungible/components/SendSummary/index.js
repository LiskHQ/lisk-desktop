/* istanbul ignore file */
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import { selectActiveToken } from '@common/store';
import {
  resetTransactionResult,
  transactionDoubleSigned,
  tokensTransferred,
} from '@common/store/actions';
import Summary from './summary';

const mapStateToProps = state => ({
  transactions: state.transactions,
  token: selectActiveToken(state),
});

const mapDispatchToProps = {
  resetTransactionResult,
  transactionDoubleSigned,
  tokensTransferred,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Summary));
