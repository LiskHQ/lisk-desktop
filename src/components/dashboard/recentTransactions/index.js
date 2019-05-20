// istanbull ignore file
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import RecentTransactions from './recentTransactions';


const mapStateToProps = state => ({
  settings: state.settings,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(RecentTransactions));
