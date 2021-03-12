/* istanbul ignore file */
import { connect } from 'react-redux';
import Converter from './converter';
import settings from 'constants';
import { tokenMap } from 'constants';

const mapStateToProps = state => ({
  currency: state.settings.currency || 'EUR',
  token: state.settings.token ? state.settings.token.active : tokenMap.LSK.key,
  priceTicker: (state.service && state.service.priceTicker)
    ? state.service.priceTicker
    : {
      LSK: settings.currencies.reduce((acc, key) => ({ ...acc, [key]: '0' })),
      BTC: settings.currencies.reduce((acc, key) => ({ ...acc, [key]: '0' })),
    },
});

export default connect(
  mapStateToProps,
)(Converter);
