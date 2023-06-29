/* istanbul ignore file */
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import ExplorerLayout from 'src/modules/wallet/components/ExplorerLayout';

export default compose(withTranslation())(ExplorerLayout);
