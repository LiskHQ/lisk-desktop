import React, { useState, useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { getTotalVotesCount } from '../../../../utils/voting';
import styles from './delegatesTable.css';
import { loadDelegates, loadVotes } from '../../../../actions/voting';
import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import BoxContent from '../../../toolbox/box/content';
import BoxTabs from '../../../toolbox/tabs';
import { Input } from '../../../toolbox/inputs';
import Table from '../../../toolbox/table';
import DelegateRow from './delegateRow';
import header from './tableHeader';

const tabsData = (t = str => str) => ([
  {
    name: t('All delegates'),
    value: 0,
    className: 'all-delegates',
    filter: list => list,
  },
  {
    name: t('Voted'),
    value: 1,
    className: 'voted',
    filter: (delegates, votes) =>
      delegates.filter(({ username }) => votes[username] && votes[username].confirmed),
  },
  {
    name: t('Not voted'),
    value: 2,
    className: 'not-voted',
    filter: (delegates, votes) =>
      delegates.filter(({ username }) => !votes[username] || !votes[username].confirmed),
  },
]);

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
      : <h2>{data.tabs[0].name}</h2>
  );
};

// eslint-disable-next-line max-statements
const DelegatesTable = ({
  t, votingModeEnabled,
}) => {
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);
  const [params, setParams] = useState({ tab: 0, q: '' });
  const { votes, delegates } = useSelector(state => state.voting);
  const account = useSelector(state => state.account);
  const { apiVersion } = useSelector(state => state.network.networks.LSK);
  const shouldShowVoteColumn = votingModeEnabled || getTotalVotesCount(votes) > 0;
  const firstTimeVotingActive = votingModeEnabled && getTotalVotesCount(votes) === 0;
  const canLoadMore = delegates.length >= 90;
  const activeTab = tabsData(t)[params.tab];
  const isSignedIn = account.info && account.info.LSK;

  const applyFilters = (filter) => {
    // eslint-disable-next-line prefer-object-spread
    setParams(Object.assign({}, params, filter));
  };

  const loadDelegatesData = () => {
    if (!isLoading) {
      setLoading(true);
      dispatch(loadDelegates({
        offset: delegates.length,
        refresh: false,
        q: '',
        callback: () => {
          setLoading(false);
        },
      }));
    }
  };

  const loadVotesData = () => {
    dispatch(loadVotes({
      address: account.info.LSK.address,
    }));
  };

  useEffect(() => {
    loadDelegatesData();
    if (isSignedIn) {
      loadVotesData();
    }
  }, []);

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
          data={activeTab.filter(delegates, votes)}
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
          canLoadMore={canLoadMore}
          error={false}
          iterationKey="username"
          emptyState={{ message: t('No delegates found.') }}
        />
      </BoxContent>
    </Box>
  );
};

export default withTranslation()(DelegatesTable);
