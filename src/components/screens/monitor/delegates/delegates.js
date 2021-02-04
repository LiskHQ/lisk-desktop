import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';
import Overview from './overview';
import { Input } from '../../../toolbox/inputs';
import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import BoxContent from '../../../toolbox/box/content';
import BoxTabs from '../../../toolbox/tabs';
import styles from './delegates.css';
import LatestVotes from './latestVotes';
import DelegatesTable from './delegatesTable';
import ForgingDetails from './forgingDetails';

// eslint-disable-next-line max-statements
const DelegatesMonitor = ({
  votedDelegates,
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

  useEffect(() => {
    const addressList = votes.data && votes.data.reduce((acc, data) => {
      const votesList = data.asset.votes || [];
      const dataAddresses = votesList.map(vote => vote.delegateAddress);
      return acc.concat(dataAddresses);
    }, []);
    if (addressList.length > 1) {
      votedDelegates.loadData({ addressList });
    }
  }, [votes.data]);

  const handleFilter = ({ target: { value } }) => {
    applyFilters({
      ...filters,
      search: value,
      offset: 0,
    });
  };
  const tabs = {
    tabs: [
      {
        value: 'active',
        name: ('Active delegates'),
        className: 'active',
      },
      {
        value: 'standby',
        name: ('Standby delegates'),
        className: 'standby',
      },
      {
        value: 'votes',
        name: ('Latest votes'),
        className: 'votes',
      },
    ],
    active: activeTab,
    onClick: ({ value }) => setActiveTab(value),
  };

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
            : <BoxTabs {...tabs} />
          }
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
                  standByDelegates={standByDelegates}
                  delegates={delegates}
                  filters={filters}
                  t={t}
                  activeTab={activeTab}
                  forgingTimes={forgingTimes}
                />
              )
          }
        </BoxContent>
      </Box>
    </div>
  );
};

export default withTranslation()(DelegatesMonitor);
