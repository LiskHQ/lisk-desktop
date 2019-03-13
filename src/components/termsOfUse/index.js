// istanbul ignore file
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { settingsUpdated } from '../../actions/settings';
import TermsOfUse from './termsOfUse';

const mapStateToProps = state => ({
  settings: state.settings,
});

const mapDispatchToProps = {
  settingsUpdated,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(TermsOfUse));
