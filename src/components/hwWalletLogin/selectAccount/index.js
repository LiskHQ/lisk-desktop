import { connect } from 'react-redux';
import { settingsUpdated } from '../../../actions/settings';
import SelectAccount from './selectAccount';

const mapDispatchToProps = {
  settingsUpdated,
};

export default connect(null, mapDispatchToProps)(SelectAccount);
