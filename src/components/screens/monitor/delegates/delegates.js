import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';
import MonitorHeader from '../header';
import Overview from './overview';
import { DEFAULT_LIMIT } from '../../../../constants/monitor';
import { forgingDataDisplayed, forgingDataConcealed } from '../../../../actions/blocks';
import { Input } from '../../../toolbox/inputs';
import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import BoxContent from '../../../toolbox/box/content';
import BoxTabs from '../../../toolbox/tabs';
import Table from '../../../toolbox/table';
import styles from './delegates.css';
import DelegateRow from './delegateRow';
import header from './tableHeader';

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

  const statuses = {
    forging: t('Forging'),
    awaitingSlot: t('Awaiting slot'),
    notForging: t('Not forging'),
    missedBlock: t('Missed block'),
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

  useEffect(() => {
    if (activeTab === 'standby') {
      delegates.loadData();
    }
  }, [activeTab]);

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
            row={DelegateRow}
            loadData={handleLoadMore}
            additionalRowProps={{
              t,
              forgingTimes,
            }}
            header={header(activeTab, changeSort, t)}
            currentSort={sort}
            canLoadMore={canLoadMore}
          />
        </BoxContent>
      </Box>
    </div>
  );
};

export default withTranslation()(DelegatesTable);
