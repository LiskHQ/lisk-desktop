import { withTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { DEFAULT_LIMIT } from '../../../../constants/monitor';
import { formatAmountBasedOnLocale } from '../../../../utils/formattedNumber';
import AccountVisualWithAddress from '../../../shared/accountVisualWithAddress';
import DelegatesTable from '../../../shared/delegatesTable';
import MonitorHeader from '../header';
import Tooltip from '../../../toolbox/tooltip/tooltip';
import routes from '../../../../constants/routes';
import Overview from './overview';
import styles from './delegates.css';
import { forgingDataDisplayed, forgingDataConcealed } from '../../../../actions/blocks';

const getForgingTime = (data) => {
  if (!data || data.time === -1) return '-';
  if (data.time === 0) return 'now';
  const { time, tense } = data;
  const minutes = time / 60 >= 1 ? `${Math.floor(time / 60)}m ` : '';
  const seconds = time % 60 >= 1 ? `${time % 60}s` : '';
  if (tense === 'future') {
    return `in ${minutes}${seconds}`;
  }
  return `${minutes}${seconds} ago`;
};

// eslint-disable-next-line max-statements
const Delegates = ({
  applyFilters,
  changeSort,
  chartActiveAndStandbyData,
  chartRegisteredDelegatesData,
  delegates,
  filters,
  isMediumViewPort,
  sort,
  standByDelegates,
  t,
}) => {
  const [activeTab, setActiveTab] = useState('active');
  const dispatch = useDispatch();
  const statuses = {
    forging: t('Forging'),
    awaitingSlot: t('Awaiting slot'),
    notForging: t('Not forging'),
    missedBlock: t('Missed block'),
  };
  const forgingTimes = useSelector(state => state.blocks.forgingTimes);

  const columns = [
    {
      id: 'rank',
      isSortable: activeTab === 'active',
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
      className: (activeTab === 'active'
        ? `${grid['col-xs-3']} ${grid['col-md-3']}`
        : `${grid['col-xs-5']} ${grid['col-md-6']}`
      ),
    },
    ...(activeTab === 'active' ? [{
      id: 'forgingTime',
      header: t('Forging time'),
      headerTooltip: t('Time until next forging slot of a delegate.'),
      /* eslint-disable-next-line react/display-name */
      getValue: data => getForgingTime(forgingTimes[data.publicKey]),
      className: `hidden-m ${grid['col-md-2']}`,
    },
    {
      id: 'status',
      header: t('Status'),
      headerTooltip: t('Current status of a delegate: forging, not forging, awaiting slot or missed block.'),
      /* eslint-disable-next-line react/display-name */
      getValue: data => (
        <Tooltip
          title={forgingTimes[data.publicKey]
            ? statuses[forgingTimes[data.publicKey].status]
            : statuses.notForging}
          className="showOnBottom"
          size="s"
          content={(
            <div className={`${styles.status} ${
              styles[forgingTimes[data.publicKey]
                ? forgingTimes[data.publicKey].status
                : 'notForging']}`
              }
            />
          )}
          footer={(
            <p>{getForgingTime(forgingTimes[data.publicKey], data)}</p>
          )}
        >
          <p className={styles.statusToolip}>
            {data.lastBlock && t('Last block forged @{{height}}', data.lastBlock)}
          </p>
        </Tooltip>
      ),
      className: `${grid['col-xs-2']} ${grid['col-md-1']} ${styles.statusTitle}`,
    },
    ] : []),
    {
      id: 'productivity',
      isSortable: activeTab === 'active',
    },
    {
      id: 'approval',
      header: t('Approval'),
      headerTooltip: t('Percentage of total supply voting for a delegate.'),
      /* eslint-disable-next-line react/display-name */
      getValue: ({ approval }) => <strong>{`${formatAmountBasedOnLocale({ value: approval })} %`}</strong>,
      className: `${grid['col-xs-2']} ${grid['col-md-1']} ${styles.approvalTitle}`,
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
    active: activeTab,
    onClick: ({ value }) => setActiveTab(value),
  };

  const canLoadMore = activeTab === 'active'
    ? false
    : !!standByDelegates.data.length && standByDelegates.data.length % DEFAULT_LIMIT === 0;

  const getRowLink = delegate => `${routes.accounts.pathPrefix}${routes.accounts.path}/${delegate.address}`;

  delegates = activeTab === 'active'
    ? {
      ...delegates,
      data: filters.search
        ? delegates.data.filter(delegate => delegate.username.includes(filters.search))
        : delegates.data,
    }
    : standByDelegates;

  useEffect(() => {
    dispatch(forgingDataDisplayed());
    return () => dispatch(forgingDataConcealed());
  }, []);

  return (
    <div>
      <MonitorHeader />
      <Overview
        chartActiveAndStandby={chartActiveAndStandbyData}
        chartDelegatesForging={forgingTimes}
        chartRegisteredDelegates={chartRegisteredDelegatesData}
        delegatesForgedLabels={Object.values(statuses)}
        t={t}
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
