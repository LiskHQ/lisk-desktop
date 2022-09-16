/* istanbul ignore file */
import React, { useRef, useState } from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { useTranslation } from 'react-i18next';
import { Input } from 'src/theme';
import Box from 'src/theme/box';
import BoxHeader from 'src/theme/box/header';
import BoxContent from 'src/theme/box/content';
import BoxTabs from 'src/theme/tabs';
import useFilter from 'src/modules/common/hooks/useFilter';
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
  watchList,
  registrations,
}) => {
  const { t } = useTranslation();
  const timeout = useRef();
  const { filters, setFilter } = useFilter({});
  const [activeDetailTab, setActiveDetailTab] = useState('overview');
  const [activeTab, setActiveTab] = useState('active');
  const [search, setSearch] = useState('');
  const { data: blocksData } = useBlocks({ config: { params: { limit: 100 } } });

  const total = blocksData?.meta?.total ?? 0;
  const blocks = blocksData?.data ?? [];
  const forgedInRound = blocks.length
    ? blocks[0].height % ROUND_LENGTH
    : 0;

  const handleFilter = ({ target: { value } }) => {
    setSearch(value);
    clearTimeout(timeout.current);

    timeout.current = setTimeout(() => {
      setFilter('search', value);
    }, 500);
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
    blocks, activeTab, setActiveTab, filters,
  };

  const displayTab = (tab) => {
    if (tab === 'votes') return <LatestVotes filters={filters} />;

    return <DelegatesTable {...commonProps} />;
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
            registrations={registrations}
            t={t}
            totalBlocks={total}
          />
        )
        : (
          <ForgingDetails
            t={t}
            forgedInRound={forgedInRound}
            startTime={blocks[forgedInRound]?.timestamp}
          />
        )}
      <Box main>
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
              value={search}
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
