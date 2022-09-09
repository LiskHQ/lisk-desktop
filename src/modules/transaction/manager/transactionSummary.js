// istanbul ignore file
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { secondPassphraseStored } from 'src/modules/auth/store/action';
import { selectActiveToken, selectActiveTokenAccount } from 'src/redux/selectors';
import TxSummarizer from '../components/TxSummarizer';

const mapStateToProps = (state) => ({
  token: selectActiveToken(state),
  wallet: selectActiveTokenAccount(state),
});

const mapDispatchToProps = {
  secondPassphraseStored,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation()
)(TxSummarizer);
