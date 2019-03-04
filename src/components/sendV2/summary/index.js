/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import Summary from './summary';

const mapStateToProps = state => ({
  account: state.account,
});

export default connect(mapStateToProps)(translate()(Summary));
