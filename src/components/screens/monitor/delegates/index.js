/* istanbul ignore file */
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import Delegates from './delegates';
import liskService from '../../../../utils/api/lsk/liskService';
import withData from '../../../../utils/withData';
import withFilters from '../../../../utils/withFilters';
import withForgingStatus from './withForgingStatus';
import withLocalSort from '../../../../utils/withLocalSort';
import withResizeValues from '../../../../utils/withResizeValues';

const defaultUrlSearchParams = { search: '' };
const delegatesKey = 'delegates';
const standByDelegatesKey = 'standByDelegates';

const mapStateToProps = ({ blocks: { latestBlocks } }) => ({
  latestBlocks,
});

const transformResponse = (response, oldData, urlSearchParams) => (
  urlSearchParams.offset
    ? [...oldData, ...response.filter(
      delegate => !oldData.find(({ username }) => username === delegate.username),
    )]
    : response
);

export default compose(
  withRouter,
  withData(
    {
      [delegatesKey]: {
        apiUtil: liskService.getActiveDelegates,
        defaultData: [],
        autoload: true,
        transformResponse,
      },
      [standByDelegatesKey]: {
        apiUtil: liskService.getStandbyDelegates,
        defaultData: [],
        autoload: true,
        transformResponse,
      },
      chartsActiveAndStandby: {
        apiUtil: liskService.getActiveAndStandByDelegates,
        defaultData: [],
        autoload: true,
        transformResponse: response => ([response.total - 101, 101]),
      },
    },
  ),
  withResizeValues,
  withFilters(standByDelegatesKey, defaultUrlSearchParams),
  connect(mapStateToProps),
  withForgingStatus(delegatesKey),
  withLocalSort(delegatesKey, 'rank:asc'),
  withTranslation(),
)(Delegates);
