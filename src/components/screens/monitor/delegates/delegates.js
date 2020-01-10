import React, { useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import MonitorHeader from '../header';
import Overview from './overview';
import { DEFAULT_LIMIT } from '../../../../constants/monitor';
import routes from '../../../../constants/routes';
import { forgingDataDisplayed, forgingDataConcealed } from '../../../../actions/blocks';
import { Input } from '../../../toolbox/inputs';
import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import BoxContent from '../../../toolbox/box/content';
import BoxTabs from '../../../toolbox/tabs';
import Table from '../../../toolbox/list';
import Tooltip from '../../../toolbox/tooltip/tooltip';
import AccountVisualWithAddress from '../../../shared/accountVisualWithAddress';
import { formatAmountBasedOnLocale } from '../../../../utils/formattedNumber';
import styles from './delegates.css';

const statuses = {
  forging: 'Forging',
  awaitingSlot: 'Awaiting slot',
  notForging: 'Not forging',
  missedBlock: 'Missed block',
};

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

const DelegateRow = React.memo(({ data, className, forgingTime }) => (
  <Link
    key={data.id}
    className={`${grid.row} ${className}`}
    to={`${routes.blocks.path}/${data.id}`}
  >
    <span className={grid['col-md-1']}>
      {`#${data.rank}`}
    </span>
    <span className={grid['col-md-2']}>
      {data.username}
    </span>
    <span className={data.rank > 101 ? `${grid['col-xs-5']} ${grid['col-md-6']}` : grid['col-md-3']}>
      <AccountVisualWithAddress address={data.address} />
    </span>
    {
      data.rank < 101 ? (
        <Fragment>
          <span className={grid['col-md-2']}>
            {getForgingTime(forgingTime)}
          </span>
          <span className={`${grid['col-xs-2']} ${grid['col-md-1']}`}>
            <Tooltip
              title={forgingTime
                ? statuses[forgingTime.status]
                : statuses.notForging}
              className="showOnBottom"
              size="s"
              content={(
                <div className={`${styles.status} ${
                  styles[forgingTime
                    ? forgingTime.status
                    : 'notForging']}`
                  }
                />
              )}
              footer={(
                <p>{getForgingTime(forgingTime, data)}</p>
              )}
            >
              <p className={styles.statusToolip}>
                {data.lastBlock && `Last block forged ${data.lastBlock}`}
              </p>
            </Tooltip>
          </span>
        </Fragment>
      ) : null
    }
    <span className={`${grid['col-xs-2']} ${grid['col-md-2']} ${grid['col-lg-2']}`}>
      {`${formatAmountBasedOnLocale({ value: data.productivity })} %`}
    </span>
    <span className={`${grid['col-xs-2']} ${grid['col-md-1']}`}>
      {data.productivity}
    </span>
  </Link>
));

const header = (activeTab, changeSort) => ([
  {
    title: 'Rank',
    classList: grid['col-md-1'],
    sort: () => changeSort('rank'),
  },
  {
    title: 'Name',
    classList: grid['col-md-2'],
  },
  {
    title: 'Address',
    classList: activeTab === 'active'
      ? grid['col-md-3']
      : `${grid['col-xs-5']} ${grid['col-md-6']}`,
  },
  {
    title: 'Forging time',
    classList: activeTab === 'active' ? grid['col-md-2'] : 'hidden',
    tooltip: {
      title: 'Forging time',
      message: 'Time until next forging slot of a delegate.',
    },
  },
  {
    title: 'Status',
    classList: activeTab === 'active'
      ? `${grid['col-xs-2']} ${grid['col-md-1']} ${styles.statusTitle}`
      : 'hidden',
    tooltip: {
      title: 'Status',
      message: 'Current status of a delegate: forging, not forging, awaiting slot or missed block.',
    },
  },
  {
    title: 'Productivity',
    classList: `${grid['col-xs-2']} ${grid['col-md-2']} ${grid['col-lg-2']}`,
    tooltip: {
      title: 'Productivity',
      message: 'Percentage of successfully forged blocks in relation to all blocks (forged and missed).',
    },
  },
  {
    title: 'Approval',
    classList: `${grid['col-xs-2']} ${grid['col-md-1']} ${styles.approvalTitle}`,
    tooltip: {
      title: 'Approval',
      message: 'Percentage of total supply voting for a delegate.',
    },
  },
]);

// eslint-disable-next-line max-statements
const DelegatesTable = ({
  chartActiveAndStandbyData,
  chartRegisteredDelegatesData,
  standByDelegates,
  applyFilters,
  changeSort,
  delegates,
  filters,
  sort,
  t,
}) => {
  const [activeTab, setActiveTab] = useState('active');
  const dispatch = useDispatch();
  const handleLoadMore = () => {
    delegates.loadData(Object.keys(filters).reduce((acc, key) => ({
      ...acc,
      ...(filters[key] && { [key]: filters[key] }),
    }), {
      offset: delegates.data.length,
    }));
  };
  const forgingTimes = useSelector(state => state.blocks.forgingTimes);

  const handleFilter = ({ target: { value } }) => {
    applyFilters({
      ...filters,
      search: value,
    });
  };

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
      <Box main isLoading={delegates.isLoading}>
        <BoxHeader className="delegates-table">
          {tabs.tabs.length === 1
            ? <h2>{tabs.tabs[0].name}</h2>
            : <BoxTabs {...tabs} />
          }
          <span>
            <Input
              onChange={handleFilter}
              value={filters.search}
              className="filter-by-name"
              size="xs"
              placeholder={t('Filter by name...')}
            />
          </span>
        </BoxHeader>
        <BoxContent className={styles.content}>
          <Table
            data={delegates.data}
            isLoading={delegates.isLoading}
            row={props =>
              <DelegateRow {...props} forgingTime={forgingTimes[props.data.publicKey]} />}
            loadData={handleLoadMore}
            header={header(activeTab, changeSort)}
            currentSort={sort}
            loadMoreButton={canLoadMore}
          />
        </BoxContent>
      </Box>
    </div>
  );
};

export default withTranslation()(DelegatesTable);
