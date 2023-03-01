// istanbul ignore file
import { connect } from 'react-redux';
import { settingsUpdated } from 'src/modules/settings/store/actions';
import { selectActiveTokenAccount } from 'src/redux/selectors';
import SelectAccount from './selectAccount';

const mapStateToProps = state => ({
  account: selectActiveTokenAccount(state),
  settings: state.settings,
  network: state.network,
});

const mapDispatchToProps = {
  settingsUpdated,
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectAccount);
