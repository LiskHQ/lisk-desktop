import { connect } from 'react-redux';
import { setDefaults, translate } from 'react-i18next';
import Splashscreen from './splashscreen';

setDefaults({
  wait: true,
  withRef: false,
  bindI18n: 'languageChanged loaded',
  bindStore: 'added removed',
  nsMode: 'default',
  translateFuncName: 't',
});

const mapStateToProps = state => ({
  account: state.account,
  peers: state.peers,
});

export default connect(mapStateToProps)(translate()(Splashscreen));
