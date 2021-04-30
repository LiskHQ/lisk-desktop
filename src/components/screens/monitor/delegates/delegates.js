import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';

import { Input } from '@toolbox/inputs';
import Box from '@toolbox/box';
import BoxHeader from '@toolbox/box/header';
import BoxContent from '@toolbox/box/content';
import BoxTabs from '@toolbox/tabs';
import styles from './delegates.css';
import Overview from './overview';
import LatestVotes from './latestVotes';
import DelegatesTable from './delegatesTable';
import ForgingDetails from './forgingDetails';

// eslint-disable-next-line max-statements
const DelegatesMonitor = ({
  votedDelegates,
  sanctionedDelegates,
  watchedDelegates,
  watchList,
  chartActiveAndStandbyData,
  chartRegisteredDelegatesData,
  standByDelegates,
  networkStatus,
  applyFilters,
  delegates,
  filters,
  votes,
  t,
}) => {
  const [activeTab, setActiveTab] = useState('active');
  const { forgingTimes, total } = useSelector(state => state.blocks);
  const delegatesWithForgingTimes = {
    ...delegates,
    data: delegates.data.map(
      data => ({ ...data, forgingTime: forgingTimes[data.publicKey] }),
    ),
  };
  const watchedDelegatesWithForgingTimes = {
    ...watchedDelegates,
    data: watchedDelegates.data.map(
      data => ({ ...data, forgingTime: forgingTimes[data.publicKey] }),
    ),
  };

  useEffect(() => {
    const addressList = votes.data && votes.data.reduce((acc, data) => {
      const votesList = data.asset.votes || [];
      const dataAddresses = votesList.map(vote => vote.delegateAddress);
      return acc.concat(dataAddresses);
    }, []);
    if (addressList.length > 0) {
      votedDelegates.loadData({ addressList });
    }
  }, [votes.data]);

  useEffect(() => {
    if (watchList.length) {
      watchedDelegates.loadData({ addressList: watchList });
    }
  }, [watchList.length]);

  const handleFilter = ({ target: { value } }) => {
    applyFilters({
      ...filters,
      search: value,
      offset: 0,
      limit: 100,
    });
  };

  const tabs = {
    tabs: [
      {
        value: 'active',
        name: t('Inside round'),
        className: 'active',
      },
      {
        value: 'standby',
        name: t('Outside round'),
        className: 'standby',
      },
      {
        value: 'sanctioned',
        name: t('Sanctioned'),
        className: 'sanctioned',
      },
      {
        value: 'votes',
        name: t('Latest votes'),
        className: 'votes',
      },

    ],
    active: activeTab,
    onClick: ({ value }) => setActiveTab(value),
  };

  if (watchList.length) {
    tabs.tabs.push({
      value: 'watched',
      name: t('Watched'),
      className: 'watched',
    });
  }

  return (
    <div>
      <Overview
        chartActiveAndStandby={chartActiveAndStandbyData}
        chartRegisteredDelegates={chartRegisteredDelegatesData}
        t={t}
        totalBlocks={total}
        supply={networkStatus.data.supply}
      />
      <ForgingDetails
        t={t}
        chartDelegatesForging={forgingTimes}
      />
      <Box main isLoading={delegates.isLoading || standByDelegates.isLoading || votes.isLoading}>
        <BoxHeader className="delegates-table">
          {tabs.tabs.length === 1
            ? <h2>{tabs.tabs[0].name}</h2>
            : <BoxTabs {...tabs} />}
          <span className={activeTab === 'votes' ? 'hidden' : ''}>
            <Input
              onChange={handleFilter}
              value={filters.search}
              className="filter-by-name"
              size="m"
              placeholder={t('Filter by name...')}
            />
          </span>
        </BoxHeader>
        <BoxContent className={styles.content}>
          {
            activeTab === 'votes'
              ? <LatestVotes votes={votes} t={t} delegates={votedDelegates} />
              : (
                <DelegatesTable
                  setActiveTab={setActiveTab}
                  delegates={delegatesWithForgingTimes}
                  watchList={watchList}
                  watchedDelegates={watchedDelegatesWithForgingTimes}
                  standByDelegates={standByDelegates}
                  sanctionedDelegates={sanctionedDelegates}
                  filters={filters}
                  t={t}
                  activeTab={activeTab}
                />
              )
          }
        </BoxContent>
      </Box>
    </div>
  );
};

export default withTranslation()(DelegatesMonitor);
