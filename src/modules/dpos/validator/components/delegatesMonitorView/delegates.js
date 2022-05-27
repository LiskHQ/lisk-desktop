/* eslint-disable complexity */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';

import { Input } from 'src/theme';
import Box from 'src/theme/box';
import BoxHeader from 'src/theme/box/header';
import BoxContent from 'src/theme/box/content';
import BoxTabs from 'src/theme/tabs';
import { ROUND_LENGTH } from '@dpos/validator/consts';
import styles from './delegates.css';
import DelegatesOverview from '../overview/delegatesOverview';
import ForgingDetails from '../overview/forgingDetails';
import LatestVotes from '../latestVotes';
import DelegatesTable from '../delegatesTable';
import ActiveDelegatesTab from '../activeDelegatesTab';
import StandByDelegatesTab from '../standByDelegatesTab';
import SanctionedDelegatesTab from '../sanctionedDelegatesTab';
import WatchedDelegatesTab from '../watchedDelegatesTab';

// eslint-disable-next-line max-statements
const DelegatesMonitor = ({
  votedDelegates,
  sanctionedDelegates,
  watchedDelegates,
  watchList,
  delegatesCount,
  registrations,
  transactionsCount,
  standByDelegates,
  networkStatus,
  applyFilters,
  filters,
  blocks,
  votes,
  t,
}) => {
  const [activeTab, setActiveTab] = useState('active');
  const { total, forgers, latestBlocks } = blocks;
  const delegatesWithForgingTimes = { data: forgers };
  const forgedInRound = latestBlocks.length
    ? latestBlocks[0].height % ROUND_LENGTH
    : 0;

  useEffect(() => {
    const addressList = votes.data
      && votes.data.reduce((acc, data) => {
        const votesList = data.asset.votes || [];
        const dataAddresses = votesList.map((vote) => vote.delegateAddress);
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
    let api;
    switch (activeTab) {
      case 'sanctioned':
        api = 'sanctionedDelegates';
        break;
      case 'watched':
        api = 'watchedDelegates';
        break;
      default:
        api = 'standByDelegates';
        break;
    }
    applyFilters(
      {
        ...filters,
        search: value,
        offset: 0,
        limit: 100,
      },
      api,
    );
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
      <DelegatesOverview
        delegatesCount={delegatesCount}
        transactionsCount={transactionsCount}
        registrations={registrations}
        t={t}
        totalBlocks={total}
        supply={networkStatus.data.supply}
      />
      <ForgingDetails
        t={t}
        forgers={forgers}
        forgedInRound={forgedInRound}
        startTime={latestBlocks[forgedInRound]?.timestamp}
      />
      <Box main isLoading={standByDelegates.isLoading || votes.isLoading}>
        <BoxHeader className={`${styles.tabSelector} delegates-table`}>
          {tabs.tabs.length === 1 ? (
            <h2>{tabs.tabs[0].name}</h2>
          ) : (
            <BoxTabs {...tabs} />
          )}
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
        <BoxContent className={`${styles.content} delegate-box`}>
          {activeTab === 'votes' ? (
            <LatestVotes votes={votes} t={t} delegates={votedDelegates} />
          ) : activeTab === 'active' ? (
            <ActiveDelegatesTab
              blocks={blocks}
              delegatesWithForgingTimes={delegatesWithForgingTimes}
              watchList={watchList}
              filters={filters}
              t={t}
              activeTab={activeTab}
            />
          ) : activeTab === 'standby' ? (
            <StandByDelegatesTab
              blocks={blocks}
              standByDelegates={standByDelegates}
              watchList={watchList}
              filters={filters}
              t={t}
              activeTab={activeTab}
            />
          ) : activeTab === 'sanctioned' ? (
            <SanctionedDelegatesTab
              blocks={blocks}
              sanctionedDelegates={sanctionedDelegates}
              watchList={watchList}
              filters={filters}
              t={t}
              activeTab={activeTab}
            />
          ) : activeTab === 'watched' ? (
            <WatchedDelegatesTab
              blocks={blocks}
              watchedDelegates={watchedDelegates}
              watchList={watchList}
              filters={filters}
              t={t}
              activeTab={activeTab}
            />
          ) : (
            <DelegatesTable
              setActiveTab={setActiveTab}
              delegates={delegatesWithForgingTimes}
              blocks={blocks}
              watchList={watchList}
              watchedDelegates={watchedDelegates}
              standByDelegates={standByDelegates}
              sanctionedDelegates={sanctionedDelegates}
              filters={filters}
              t={t}
              activeTab={activeTab}
            />
          )}
        </BoxContent>
      </Box>
    </div>
  );
};

export default DelegatesMonitor;
