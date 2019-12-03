/* istanbul ignore file */
import { connect } from 'react-redux';
import withTheme from '../../../utils/theme';
import OfflineWrapper from './offlineWrapper';

const mapStateToProps = state => ({
  offline: state.loading && state.loading.indexOf('offline') > -1,
});

export default connect(mapStateToProps)(withTheme(OfflineWrapper));
