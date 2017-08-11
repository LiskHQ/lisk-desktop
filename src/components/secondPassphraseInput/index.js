import { connect } from 'react-redux';
import SecondPassphraseInput from './secondPassphraseInput';

const mapStateToProps = state => ({
  hasSecondPassphrase: !!state.account.secondSignature,
});

export default connect(mapStateToProps)(SecondPassphraseInput);

