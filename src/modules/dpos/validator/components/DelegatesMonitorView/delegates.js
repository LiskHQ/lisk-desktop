/* istanbul ignore file */
/* eslint-disable complexity */
import React, { useState, useEffect } from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { Input } from 'src/theme';
import Box from 'src/theme/box';
import BoxHeader from 'src/theme/box/header';
import BoxContent from 'src/theme/box/content';
import BoxTabs from 'src/theme/tabs';
import Icon from 'src/theme/Icon';
import { ROUND_LENGTH } from '@dpos/validator/consts';
import { PrimaryButton } from 'src/theme/buttons';
import { useBlocks } from 'src/modules/block/hooks/queries/useBlocks';
import DelegatesOverview from '../Overview/delegatesOverview';
import ForgingDetails from '../Overview/forgingDetails';
import DelegatesTable from '../DelegatesTable';
import LatestVotes from '../LatestVotes';
import styles from './delegates.css';

// eslint-disable-next-line max-statements
const DelegatesMonitor = ({
  votedDelegates,
  sanctionedDelegates,
  watchedDelegates,
  watchList,
  delegatesCount,
  registrations,
  standByDelegates,
  applyFilters,
  filters,
  blocks,
  votes,
  t,
}) => {
  const [activeDetailTab, setActiveDetailTab] = useState('overview');
  const [activeTab, setActiveTab] = useState('active');
  const { /* total, */ forgers, latestBlocks } = blocks;
  const { data: blocksData } = useBlocks({ config: { params: { limit: 1 } } });
  const total = blocksData?.meta?.total ?? 0;
  const delegatesWithForgingTimes = { data: forgers };
  const forgedInRound = latestBlocks.length
    ? latestBlocks[0].height % ROUND_LENGTH
    : 0;

  useEffect(() => {
    const addressList = votes.data
      && votes.data.reduce((acc, data) => {
        const votesList = data.params.votes || [];
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

  const pageTabs = {
    tabs: [
      {
        value: 'overview',
        name: t('Overview'),
        className: 'overview',
      },
      {
        value: 'forging-details',
        name: t('Forging details'),
        className: 'forging-details',
      },
    ],
    active: activeDetailTab,
    onClick: ({ value }) => setActiveDetailTab(value),
  };

  if (watchList.length) {
    tabs.tabs.push({
      value: 'watched',
      name: t('Watched'),
      className: 'watched',
    });
  }

  const commonProps = {
    blocks, filters, watchList, activeTab,
  };

  const watchedFilters = {
    search: filters.search || '',
    address: watchList,
  };

  const displayTab = (tab) => {
    if (tab === 'active') return <DelegatesTable {...commonProps} delegates={delegatesWithForgingTimes} />;
    if (tab === 'standby') return <DelegatesTable {...commonProps} delegates={standByDelegates} hasLoadMore />;
    if (tab === 'sanctioned') return <DelegatesTable {...commonProps} delegates={sanctionedDelegates} hasLoadMore />;
    if (tab === 'watched') return <DelegatesTable {...commonProps} delegates={watchedDelegates} filters={watchedFilters} setActiveTab={setActiveTab} />;
    if (tab === 'votes') return <LatestVotes votes={votes} delegates={votedDelegates} />;
    return null;
  };

  return (
    <Box>
      <BoxHeader className={`${styles.delegatePageWrapper}`}>
        <div className={grid.row}>
          <div className={grid['col-md-8']}>
            <h3>{t('Delegates')}</h3>
            <BoxTabs {...pageTabs} />
          </div>
          <div className={grid['col-md-4']}>
            <PrimaryButton>Register delegate</PrimaryButton>
          </div>
        </div>
      </BoxHeader>
      {activeDetailTab === 'overview'
        ? (
          <DelegatesOverview
            delegatesCount={delegatesCount}
            registrations={registrations}
            t={t}
            totalBlocks={total}
          />
        )
        : (
          <ForgingDetails
            t={t}
            forgedInRound={forgedInRound}
            startTime={latestBlocks[forgedInRound]?.timestamp}
          />
        )}
      <Box main isLoading={standByDelegates.isLoading || votes.isLoading}>
        <BoxHeader className={`${styles.tabSelector} delegates-table`}>
          {tabs.tabs.length === 1 ? (
            <h2>{tabs.tabs[0].name}</h2>
          ) : (
            <BoxTabs {...tabs} />
          )}
          <span className={activeTab === 'votes' ? 'hidden' : ''}>
            <Input
              icon={<Icon className={styles.searchIcon} name="searchActive" />}
              onChange={handleFilter}
              value={filters.search}
              className={`${styles.filterDelegates} filter-by-name`}
              size="m"
              placeholder={t('Search by name')}
            />
          </span>
        </BoxHeader>
        <BoxContent className={`${styles.content} delegate-box`}>
          {displayTab(activeTab)}
        </BoxContent>
      </Box>
    </Box>
  );
};

export default DelegatesMonitor;
