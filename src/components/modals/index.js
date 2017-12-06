import { connect } from 'react-redux';
import copy from 'copy-to-clipboard';
import { translate } from 'react-i18next';

import SuccessModal from './successModal';

const mapDispatchToProps = () => ({
  copyToClipboard: (...args) => copy(...args),
});

export default connect(mapDispatchToProps)(translate()(SuccessModal));
