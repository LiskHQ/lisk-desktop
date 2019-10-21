/* istanbul ignore file */
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import Delegates from './delegates';
import liskService from '../../../../utils/api/lsk/liskService';
import withData from '../../../../utils/withData';
import withFilters from '../../../../utils/withFilters';
import withForgingStatus from './withForgingStatus';

const defaultUrlSearchParams = { tab: 'active' };
const delegatesKey = 'delegates';

export default compose(
  withRouter,
  withData({
    [delegatesKey]: {
      apiUtil: liskService.getDelegates,
      defaultData: [],
      defaultUrlSearchParams,
      autoload: true,
      transformResponse: (response, oldData, urlSearchParams) => (
        urlSearchParams.offset
          ? [...oldData, ...response.filter(
            delegate => !oldData.find(({ username }) => username === delegate.username),
          )]
          : response
      ),
    },
  }),
  withFilters(delegatesKey, defaultUrlSearchParams),
  withForgingStatus(delegatesKey),
  withTranslation(),
)(Delegates);
