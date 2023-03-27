/* istanbul ignore file */
import { connect } from 'react-redux';
import settingConstants from 'src/modules/settings/const/settingConstants';
import { selectActiveToken } from 'src/redux/selectors';
import Converter from './converter';

const mapStateToProps = (state) => ({
  currency: state.settings.currency || 'EUR',
  token: selectActiveToken(state),
  priceTicker:
    state.service && state.service.priceTicker
      ? state.service.priceTicker
      : {
          LSK: settingConstants.currencies.reduce((acc, key) => ({ ...acc, [key]: '0' })),
        },
});

export default connect(mapStateToProps)(Converter);
