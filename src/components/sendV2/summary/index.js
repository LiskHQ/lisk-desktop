/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import Summary from './summary';

export default connect()(translate()(Summary));
