import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import SeaarchBar from './searchBar';

export default connect()((translate()(SeaarchBar)));
