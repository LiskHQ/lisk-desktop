import { withTranslation } from 'react-i18next';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import moment from 'moment';
import { DEFAULT_LIMIT } from '../../../../constants/monitor';
import { formatAmountBasedOnLocale } from '../../../../utils/formattedNumber';
import { getUnixTimestampFromValue } from '../../../../utils/datetime';
import AccountVisualWithAddress from '../../../shared/accountVisualWithAddress';
import DelegatesTable from '../../../shared/delegatesTable';
import MonitorHeader from '../header';
import Tooltip from '../../../toolbox/tooltip/tooltip';
import routes from '../../../../constants/routes';
import styles from './delegates.css';
import ForgingDetails from './forgingDetails';

const Delegates = ({
  delegates, t, filters, applyFilters, changeSort, sort,
  isMediumViewPort, networkStatus, lastBlock, nextForgers,
}) => {
  const getForgingTitle = status => ({
    forgedThisRound: t('Forging'),
    forgedLastRound: t('Awaiting slot'),
    notForging: t('Not forging'),
    missedLastRound: t('Missed block'),
  }[status] || t('Loading'));

  const columns = [
    {
      id: 'rank',
      isSortable: filters.tab === 'active',
    },
    {
      id: 'username',
      header: ('Name'),
      className: grid['col-xs-2'],
    },
    {
      id: 'address',
      header: t('Address'),
      /* eslint-disable-next-line react/display-name */
      getValue: ({ address }) => <AccountVisualWithAddress {...{ address, isMediumViewPort }} />,
      className: (filters.tab === 'active'
        ? [grid['col-xs-3'], grid['col-md-3']]
        : [grid['col-xs-5'], grid['col-md-6']]
      ).join(' '),
    },
    ...(filters.tab === 'active' ? [{
      id: 'forgingTime',
      header: t('Forging time'),
      headerTooltip: t('Time until next forging slot of a delegate.'),
      /* eslint-disable-next-line react/display-name */
      getValue: ({ forgingTime }) => (forgingTime
        ? moment(forgingTime.diff(moment())).format(t('m [min] s [sec]'))
        : '-'),
      className: ['hidden-m', grid['col-md-2']].join(' '),
    },
    {
      id: 'status',
      header: t('Status'),
      headerTooltip: t('Current status of a delegate: forging, not forging, awaiting slot or missed block.'),
      /* eslint-disable-next-line react/display-name */
      getValue: ({ status, lastBlock }) => (
        <Tooltip
          title={getForgingTitle(status)}
          className="showOnBottom"
          size="s"
          content={(<div className={[styles.status, styles[status]].join(' ')} />)}
          footer={(
            <p>{lastBlock && moment(getUnixTimestampFromValue(lastBlock.timestamp)).fromNow()}</p>
          )}
        >
          <p className={styles.statusToolip}>
            {lastBlock && t('Last block forged @{{height}}', lastBlock)}
          </p>
        </Tooltip>
      ),
      className: [grid['col-xs-2'], grid['col-md-1'], styles.statusTitle].join(' '),
    },
    ] : []),
    {
      id: 'productivity',
      isSortable: filters.tab === 'active',
    },
    {
      id: 'approval',
      header: t('Approval'),
      headerTooltip: t('Percentage of total supply voting for a delegate.'),
      /* eslint-disable-next-line react/display-name */
      getValue: ({ approval }) => <strong>{`${formatAmountBasedOnLocale({ value: approval })} %`}</strong>,
      className: [grid['col-xs-2'], grid['col-md-1'], styles.approvalTitle].join(' '),
    },
  ];

  const tabs = {
    tabs: [
      {
        value: 'active',
        name: ('Active delegates'),
        className: 'active',
      }, {
        value: 'standby',
        name: ('Standby delegates'),
        className: 'standby',
      },
    ],
    active: filters.tab,
    onClick: ({ value }) => applyFilters({ ...filters, tab: value }),
  };

  const canLoadMore = filters.tab === 'active'
    ? false
    : !!delegates.data.length && delegates.data.length % DEFAULT_LIMIT === 0;

  const getRowLink = delegate => `${routes.accounts.pathPrefix}${routes.accounts.path}/${delegate.address}`;

  return (
    <div>
      <MonitorHeader />
      <ForgingDetails
        t={t}
        lastBlock={lastBlock}
        networkStatus={networkStatus}
        nextForgers={nextForgers}
      />
      <DelegatesTable {...{
        columns,
        delegates,
        tabs,
        filters,
        applyFilters,
        canLoadMore,
        getRowLink,
        onSortChange: changeSort,
        sort,
      }}
      />
    </div>
  );
};

export default withTranslation()(Delegates);
