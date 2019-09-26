/* istanbul ignore file */
import { connect } from 'react-redux';
import { pricesRetrieved } from '../../actions/service';
import { settingsUpdated } from '../../actions/settings';
import Converter from './converter';
import { currencies } from '../../constants/settings';

const mapStateToProps = state => ({
  settings: state.settings,
  token: state.settings.token && state.settings.token.active,
  priceTicker: (state.service && state.service.priceTicker)
    ? state.service.priceTicker
    : {
      LSK: currencies.reduce((acc, key) => ({ ...acc, [key]: '0' })),
      BTC: currencies.reduce((acc, key) => ({ ...acc, [key]: '0' })),
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
