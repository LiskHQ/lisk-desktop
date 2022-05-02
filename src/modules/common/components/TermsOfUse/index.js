// istanbul ignore file
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { settingsUpdated } from '@common/store/actions';
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
)(withTranslation()(TermsOfUse));
