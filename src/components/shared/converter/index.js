/* istanbul ignore file */
import { connect } from 'react-redux';

import { settingsUpdated } from '../../../actions/settings';
import { pricesRetrieved } from '../../../actions/service';
import Converter from './converter';

const mapStateToProps = state => ({
  settings: state.settings,
  token: state.settings.token && state.settings.token.active,
  priceTicker: (state.service && state.service.priceTicker)
    ? state.service.priceTicker
    : {
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
)(Converter);
