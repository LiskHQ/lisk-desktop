/* istanbul ignore file */
import { connect } from 'react-redux';
import settingConstants from 'src/modules/settings/const/settingConstants';
import { tokenMap } from '@token/fungible/consts/tokens';
import Converter from './converter';

const mapStateToProps = state => ({
  currency: state.settings.currency || 'EUR',
  token: state.token ? state.token.active : tokenMap.LSK.key,
  priceTicker: (state.service && state.service.priceTicker)
    ? state.service.priceTicker
    : {
      LSK: settingConstants.currencies.reduce((acc, key) => ({ ...acc, [key]: '0' })),
      BTC: settingConstants.currencies.reduce((acc, key) => ({ ...acc, [key]: '0' })),
    },
});

export default connect(
  mapStateToProps,
)(Converter);
