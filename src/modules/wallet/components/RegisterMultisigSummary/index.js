// istanbul ignore file
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { multisigTransactionSigned } from 'src/redux/actions';
import { selectActiveTokenAccount } from 'src/redux/selectors';

import Summary from './Summary';

const mapStateToProps = (state) => ({
  account: selectActiveTokenAccount(state),
  transactions: state.transactions,
});

const mapDispatchToProps = {
  multisigTransactionSigned,
};

export default compose(connect(mapStateToProps, mapDispatchToProps), withTranslation())(Summary);
