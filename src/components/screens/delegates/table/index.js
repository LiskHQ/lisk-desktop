import React, { useState, useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getTotalVotesCount } from '../../../../utils/voting';
import styles from './delegatesTable.css';
import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import BoxContent from '../../../toolbox/box/content';
import BoxTabs from '../../../toolbox/tabs';
import { Input } from '../../../toolbox/inputs';
import Table from '../../../toolbox/table';
import DelegateRow from './delegateRow';
import header from './tableHeader';
import { loadDelegates } from '../../../../actions/voting';

const tabsData = (t = str => str) => {
  const [data, setData] = useState([[], [], []]);
  const save = (list, reset, tabIndex) => {
    setData(data.map((item, index) => {
      if (index !== tabIndex) return item;
      if (reset) return list.concat(data[tabIndex]);
      return list;
    }));
  };
  return [
    {
      name: t('All delegates'),
      value: 0,
      className: 'all-delegates',
      filter: list => list,
      trigger: list => list.length % 30 === 0,
      data: data[0],
      save: (list, reset) => save(list, reset, 0),
    },
    {
      name: t('Voted'),
      value: 1,
      className: 'voted',
      filter: (delegates, votes) =>
        delegates.filter(({ username }) => votes[username] && votes[username].confirmed),
      trigger: (list, votes) => list.length < votes.length,
      data: data[1],
      save: (list, reset) => save(list, reset, 1),
    },
    {
      name: t('Not voted'),
      value: 2,
      className: 'not-voted',
      filter: (delegates, votes) =>
        delegates.filter(({ username }) => !votes[username] || !votes[username].confirmed),
      trigger: list => list.length % 30 === 0,
      data: data[2],
      save: (list, reset) => save(list, reset, 2),
    },
  ];
};

const Tabs = ({ t, onTabChange, isSignedIn }) => {
  const tabs = tabsData(t);
  const [active, setActive] = useState(tabs[0].value);
  const data = {
    tabs: isSignedIn ? tabs : tabs[0],
    active,
    onClick: ({ value }) => {
      setActive(value);
      onTabChange({ tab: value });
    },
  };

  return (
    isSignedIn
      ? <BoxTabs {...data} />
      : <h2>{tabs[0].name}</h2>
  );
};

// eslint-disable-next-line max-statements
const DelegatesTable = ({
  t, votingModeEnabled, isSignedIn,
}) => {
  const [isLoading, setLoading] = useState(false);
  const [params, setParams] = useState({ tab: 0, q: '' });
  const activeTab = tabsData(t)[params.tab];
  const { votes } = useSelector(state => state.voting);
  const network = useSelector(state => state.network);
  const { apiVersion } = useSelector(state => state.network.networks.LSK);
  const shouldShowVoteColumn = votingModeEnabled || getTotalVotesCount(votes) > 0;
  const firstTimeVotingActive = votingModeEnabled && getTotalVotesCount(votes) === 0;

  const applyFilters = (filter) => {
    // eslint-disable-next-line prefer-object-spread
    setParams(Object.assign({}, params, filter));
  };

  const loadDelegatesData = (reset) => {
    if (!isLoading) {
      setLoading(true);
      loadDelegates({ ...params, network })
        .then(({ data }) => {
          activeTab.save(activeTab.filter(data, votes), reset);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    loadDelegatesData(true);
  }, []);

  useEffect(() => {
    if (activeTab.data.length === 0) {
      loadDelegatesData(true);
    }
  }, [params.tab]);

  return (
    <Box main isLoading={false}>
      <BoxHeader className="delegates-table">
        <Tabs t={t} onTabChange={applyFilters} isSignedIn={isSignedIn} />
        <span>
          <Input
            onChange={({ target }) => applyFilters({ q: target.value })}
            value={params.q}
            className={`${styles.searchInput} filter-by-name`}
            size="xs"
            placeholder={t('Filter by name...')}
          />
        </span>
      </BoxHeader>
      <BoxContent className={styles.content}>
        <Table
          data={activeTab.data}
          isLoading={isLoading}
          additionalRowProps={{
            firstTimeVotingActive,
            shouldShowVoteColumn,
            votingModeEnabled,
            apiVersion,
          }}
          row={DelegateRow}
          loadData={loadDelegatesData}
          header={header(shouldShowVoteColumn, t, apiVersion)}
          canLoadMore
          error={false}
          iterationKey="username"
          emptyState={{ message: t('No delegates found.') }}
        />
      </BoxContent>
    </Box>
  );
};

export default withTranslation()(DelegatesTable);
