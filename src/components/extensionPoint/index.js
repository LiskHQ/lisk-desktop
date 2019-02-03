/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import ExtensionPoint from './extensionPoint';

const mapStateToProps = state => ({
  modules: (state.extensions && state.extensions.modules) || {},
});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(ExtensionPoint));

