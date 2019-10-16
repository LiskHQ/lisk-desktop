/* istanbul ignore file */
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import Delegates from './delegates';
import liskService from '../../../../utils/api/lsk/liskService';
import withData from '../../../../utils/withData';
import withFilters from '../../../../utils/withFilters';

export default compose(
  withRouter,
  withData({
    delegates: {
      apiUtil: liskService.getDelegates,
      defaultData: [],
      autoload: true,
      transformResponse: (response, oldData) => (
        [...oldData, ...response.filter(block => !oldData.find(({ id }) => id === block.id))]
      ),
    },
  }),
  withFilters('delegates', { tabs: '/active' }),
  withTranslation(),
)(Delegates);
