/* istanbul ignore file */
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import moment from 'moment';
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
        transformResponse: response => response.total,
      },

      chartsRegisteredDelegates: {
        apiUtil: liskService.getRegisteredDelegates,
        defaultData: [],
        autoload: true,
        transformResponse: (response) => {
          const result = response.reduce((acc, delegate) => {
            const newObj = { ...delegate, timestamp: moment(delegate.timestamp * 1000).format('MMM YY') };
            return {
              ...acc,
              [newObj.timestamp]: ((acc[newObj.timestamp] || 0) + 1),
            };
          }, {});

          return Object.entries(result)
            .map(coordenate => ({ x: coordenate[0], y: coordenate[1] }))
            .sort((categoryA, categoryB) => categoryB - categoryA)
            .slice(-4);
        },
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
