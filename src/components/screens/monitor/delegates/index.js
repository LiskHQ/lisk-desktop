/* istanbul ignore file */
import React from 'react';
import { compose } from 'redux';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import moment from 'moment';
import Delegates from './delegates';
import liskService from '../../../../utils/api/lsk/liskService';
import withData from '../../../../utils/withData';
import withFilters from '../../../../utils/withFilters';
import withLocalSort from '../../../../utils/withLocalSort';
import withResizeValues from '../../../../utils/withResizeValues';
import NotAvailable from '../notAvailable';

const defaultUrlSearchParams = { search: '' };
const delegatesKey = 'delegates';
const standByDelegatesKey = 'standByDelegates';

const transformResponse = (response, oldData, urlSearchParams) => (
  urlSearchParams.offset
    ? [...oldData, ...response.filter(
      delegate => !oldData.find(({ username }) => username === delegate.username),
    )]
    : response
);

const ComposedDelegates = compose(
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

      chartActiveAndStandbyData: {
        apiUtil: liskService.getActiveAndStandByDelegates,
        defaultData: [],
        autoload: true,
        transformResponse: response => response.total,
      },

      chartRegisteredDelegatesData: {
        apiUtil: liskService.getRegisteredDelegates,
        defaultData: [],
        autoload: true,
        transformResponse: (response) => {
          // This function is to iterate over the list of delegates and GROUP BY
          // timestamp (Month and Year) and count how many users reegistered as
          // delegate in the month
          const responseFormatted = response.reduce((acc, delegate) => {
            const newDelegate = { ...delegate, timestamp: moment(delegate.timestamp * 1000).startOf('month').toISOString() };
            return {
              ...acc,
              [newDelegate.timestamp]: ((acc[newDelegate.timestamp] || 0) + 1),
            };
          }, {});

          return Object.entries(responseFormatted)
            .map(delegate => ({ x: delegate[0], y: delegate[1] }))
            .sort((dateA, dateB) => (dateB.x > dateA.x ? -1 : 1))
            .slice(-4)
            .map(delegate => ({ ...delegate, x: moment(delegate.x).format('MMM YY') }));
        },
      },
    },
  ),
  withResizeValues,
  withFilters(standByDelegatesKey, defaultUrlSearchParams),
  withLocalSort(delegatesKey, 'rank:asc'),
  withTranslation(),
)(Delegates);

const DelegatesMonitor = () => {
  const network = useSelector(state => state.network);

  return (
    liskService.getLiskServiceUrl(network) === null
      ? <NotAvailable />
      : <ComposedDelegates />
  );
};

export default DelegatesMonitor;
