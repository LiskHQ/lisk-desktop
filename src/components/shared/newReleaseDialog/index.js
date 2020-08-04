
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import NewReleaseDialog from './newReleaseDialog';

const mapStateToProps = state => ({
  ipc: state.appUpdates.ipc,
  releaseNotes: state.appUpdates.releaseNotes,
  version: state.appUpdates.version,
});

export default connect(mapStateToProps)(withTranslation()(NewReleaseDialog));
