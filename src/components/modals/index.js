import { connect } from 'react-redux';
import copy from 'copy-to-clipboard';
import { translate } from 'react-i18next';

import Modal from './modal';

const mapDispatchToProps = () => ({
  copyToClipboard: (...args) => copy(...args),
});

export default connect(mapDispatchToProps)(translate()(Modal));
