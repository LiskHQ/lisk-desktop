/* istanbul ignore file */
import { connect } from 'react-redux';
import { pricesRetrieved } from '../../../actions/service';
import Converter from './converter';
import settings from '../../../constants/settings';

const mapStateToProps = state => ({
  settings: state.settings,
  token: state.settings.token && state.settings.token.active,
  priceTicker: (state.service && state.service.priceTicker)
    ? state.service.priceTicker
    : {
      LSK: settings.currencies.reduce((acc, key) => ({ ...acc, [key]: '0' })),
      BTC: settings.currencies.reduce((acc, key) => ({ ...acc, [key]: '0' })),
    },
});

const mapDispatchToProps = {
  pricesRetrieved,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Converter);
