/* istanbul ignore file */
import { connect } from 'react-redux';
import Converter from './converter';

const mapStateToProps = (state) => ({
  currency: state.settings.currency || 'EUR',
});

export default connect(mapStateToProps)(Converter);
