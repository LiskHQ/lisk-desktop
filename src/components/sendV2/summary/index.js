/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { sent } from '../../../actions/transactions';
import Summary from './summary';

const mapStateToProps = state => ({
  account: state.account,
});

const mapDispatchToProps = {
  sent,
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(Summary));
