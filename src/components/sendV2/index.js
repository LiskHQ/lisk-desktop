/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import Send from './send';

const mapStateToProps = state => ({
  account: state.account,
});

export default connect(mapStateToProps)(translate()(Send));
