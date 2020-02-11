import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getTotalVotesCount } from '../../../../utils/voting';
import styles from './delegatesTable.css';
import voteFilters from '../../../../constants/voteFilters';
import votingConst from '../../../../constants/voting';
import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import BoxContent from '../../../toolbox/box/content';
import BoxTabs from '../../../toolbox/tabs';
import { Input } from '../../../toolbox/inputs';
import Table from '../../../toolbox/table';
import DelegateRow from './delegateRow';
import header from './tableHeader';

const Tabs = ({ t, onTabChange }) => {
  const IsSignedIn = useSelector(state => state.account && state.account.passphrase);
  const [active, setActive] = useState(0);
  const data = {
    tabs: [{
      name: t('All delegates'),
      value: voteFilters.all,
      className: 'all-delegates',
    },
    ...(IsSignedIn ? [{
      name: t('Voted'),
      value: voteFilters.voted,
      className: 'voted',
    }, {
      name: t('Not voted'),
      value: voteFilters.notVoted,
      className: 'not-voted',
    }] : []),
    ],
    active,
    onClick: ({ value }) => {
      setActive(value);
      onTabChange({ tab: value });
    },
  };

  return (
    IsSignedIn
      ? <BoxTabs {...data} />
      : <h2>{data.tabs[0].name}</h2>
  );
};

//   const handleLoadMore = () => {
//     delegates.loadData(Object.keys(filters).reduce((acc, key) => ({
//       ...acc,
//       ...(filters[key] && { [key]: filters[key] }),
//     }), {
//       offset: delegates.data.length,
//     }));
//   };

const DelegatesTable = ({
  t, delegates, votingModeEnabled, votes,
}) => {
  const shouldShowVoteColumn = votingModeEnabled || getTotalVotesCount(votes) > 0;
  const firstTimeVotingActive = votingModeEnabled && getTotalVotesCount(votes) === 0;
  const canLoadMore = delegates.data.length >= votingConst.numberOfActiveDelegates;
  const [params, setParams] = useState({ tab: 0, q: '' });

  const applyFilters = (filter) => {
    // eslint-disable-next-line prefer-object-spread
    const newFilters = Object.assign({}, params, filter);
    setParams(newFilters);
  };

  return (
    <Box main isLoading={delegates.isLoading}>
      <BoxHeader className="delegates-table">
        <Tabs t={t} onTabChange={applyFilters} />
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
          data={delegates.data}
          isLoading={delegates.isLoading}
          additionalRowProps={{
            firstTimeVotingActive,
            shouldShowVoteColumn,
            votingModeEnabled,
            apiVersion: '3',
          }}
          row={DelegateRow}
          loadData={delegates.loadData}
          header={header(shouldShowVoteColumn, t, '3')}
          canLoadMore={canLoadMore}
          error={delegates.error}
          iterationKey="username"
          emptyState={{ message: t('No delegates found.') }}
        />
      </BoxContent>
    </Box>
  );
};

export default withTranslation()(DelegatesTable);
