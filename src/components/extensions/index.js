/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import Extensions from './extensions';

const mapStateToProps = state => {};

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(Extensions));

