/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { dynamicFeesRetrieved } from '../../../actions/service';
import { tokenMap } from '../../../constants/tokens';
import Form from './form';

const mapStateToProps = state => ({
  account: state.account,
  followedAccounts: state.followedAccounts,
  token: localStorage.getItem('btc') ? (state.settings.token && state.settings.token.active) : tokenMap.LSK.key,
  dynamicFees: state.service.dynamicFees,
});

const mapDispatchToProps = {
  dynamicFeesRetrieved,
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(Form));
