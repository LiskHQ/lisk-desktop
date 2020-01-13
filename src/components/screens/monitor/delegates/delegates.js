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
import Table from '../../../toolbox/list';
import styles from './delegates.css';
import DelegateRow from './delegateRow';
import header from './tableHeader';

const statuses = {
  forging: 'Forging',
  awaitingSlot: 'Awaiting slot',
  notForging: 'Not forging',
  missedBlock: 'Missed block',
};

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
