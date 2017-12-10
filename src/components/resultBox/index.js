import { connect } from 'react-redux';
import copy from 'copy-to-clipboard';
import { translate } from 'react-i18next';

import ResultBox from './resultBox';

const mapDispatchToProps = () => ({
  copyToClipboard: (...args) => copy(...args),
});

export default connect(mapDispatchToProps)(translate()(ResultBox));
