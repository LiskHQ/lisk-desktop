/* istanbul ignore file */
import { connect } from 'react-redux';

import { settingsUpdated } from '../../actions/settings';
import { pricesRetrieved } from '../../actions/service';
import ConverterV2 from './converterV2';
import { tokenMap } from '../../constants/tokens';

const mapStateToProps = state => ({
  settings: state.settings,
  token: localStorage.getItem('btc') ? (state.settings.token && state.settings.token.active) : tokenMap.LSK.key,
  priceTicker: (state.service && state.service.priceTicker) ?
    state.service.priceTicker :
    {
      LSK: { USD: '0', EUR: '0' },
      BTC: { USD: '0', EUR: '0' },
    },
});

const mapDispatchToProps = {
  settingsUpdated,
  pricesRetrieved,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConverterV2);
