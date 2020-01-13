import { Link } from 'react-router-dom';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { getTotalVotesCount } from '../../../../utils/voting';
import { tokenMap } from '../../../../constants/tokens';
import AvatarWithNameAndAddress from '../../../shared/avatarWithNameAndAddress';
import FirstTimeVotingOverlay from './firstTimeVotingOverlay';
import LiskAmount from '../../../shared/liskAmount';
import VoteCheckbox from './voteCheckbox';
import routes from '../../../../constants/routes';
import styles from './delegatesTable.css';
import voteFilters from '../../../../constants/voteFilters';
import votingConst from '../../../../constants/voting';
import withDelegatesData from './withDelegatesData';
import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import BoxContent from '../../../toolbox/box/content';
import BoxTabs from '../../../toolbox/tabs';
import { Input } from '../../../toolbox/inputs';
import Table from '../../../toolbox/list';
import { formatAmountBasedOnLocale } from '../../../../utils/formattedNumber';

const DelegateRow = React.memo(({
  data, className, shouldShowVoteColumn, firstTimeVotingActive,
}) => (
  <div
    key={data.id}
    className={`${grid.row} ${className}`}
  >
    <span className={`${shouldShowVoteColumn ? grid['col-md-1'] : 'hidden'}`}>
      <VoteCheckbox
        delegate={data}
        votingModeEnabled={shouldShowVoteColumn}
        className={styles.checkbox}
        accent={firstTimeVotingActive}
      />
    </span>
    <span className={grid['col-xs-1']}>
      {`#${data.rank}`}
    </span>
    <span className={`${grid['col-xs-4']} ${grid['col-md-4']}`}>
      <Link
        className={styles.delegateLink}
        to={shouldShowVoteColumn
          ? routes.delegates.path
          : `${routes.accounts.pathPrefix}${routes.accounts.path}/${data.account.address}`}
      >
        <AvatarWithNameAndAddress {...data} />
      </Link>
    </span>
    <span className={grid['col-md-2']}>
      <LiskAmount val={data.rewards} token={tokenMap.LSK.key} />
    </span>
    <span className={grid['col-xs-2']}>
      {`${formatAmountBasedOnLocale({ value: data.productivity })} %`}
    </span>
    <span className={grid['col-md-2']}>
      <strong><LiskAmount val={data.vote} roundTo={0} token={tokenMap.LSK.key} /></strong>
    </span>
  </div>
));

const header = shouldShowVoteColumn => ([
  {
    title: 'Vote',
    classList: `${shouldShowVoteColumn ? grid['col-md-1'] : 'hidden'}`,
  },
  {
    title: 'Rank',
    classList: grid['col-md-1'],
  },
  {
    title: 'Delegate',
    classList: `${shouldShowVoteColumn ? grid['col-xs-4'] : grid['col-xs-5']}`,
  },
  {
    title: 'Forged',
    classList: `${grid['col-md-2']}`,
    tooltip: {
      title: 'forged',
      message: 'Total amount of LSK forged by a delegate.',
    },
  },
  {
    title: 'Productivity',
    classList: grid['col-xs-2'],
    tooltip: {
      message: 'Percentage of successfully forged blocks in relation to all blocks (forged and missed).'
    },
  },
  {
    title: 'Vote weight',
    classList: grid['col-md-2'],
    tooltip: {
      title: 'Vote Weight',
      message: 'Sum of LSK in all accounts who have voted for this delegate.',
    },
  },
]);

const DelegatesTableMain = ({
  delegates, tabs, t, filters, applyFilters, firstTimeVotingActive, shouldShowVoteColumn,
}) => {
  const handleLoadMore = () => {
    delegates.loadData(Object.keys(filters).reduce((acc, key) => ({
      ...acc,
      ...(filters[key] && { [key]: filters[key] }),
    }), {
      offset: delegates.data.length,
    }));
  };

  const handleFilter = ({ target: { value } }) => {
    applyFilters({
      ...filters,
      search: value,
    });
  };

  return (
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
          row={props => (
            <DelegateRow
              {...props}
              firstTimeVotingActive={firstTimeVotingActive}
              shouldShowVoteColumn={shouldShowVoteColumn}
            />
          )}
          loadData={handleLoadMore}
          header={header(shouldShowVoteColumn)}
        />
      </BoxContent>
    </Box>
  );
};

const DelegatesTable = ({
  t, delegates, filters, applyFilters, votingModeEnabled, votes, voteToggled, account,
}) => {
  const shouldShowVoteColumn = votingModeEnabled || getTotalVotesCount(votes) > 0;
  const firstTimeVotingActive = votingModeEnabled && getTotalVotesCount(votes) === 0;

  const tabs = {
    tabs: [{
      name: t('All delegates'),
      value: voteFilters.all,
      className: 'all-delegates',
    },
    ...(account.address ? [{
      name: t('Voted'),
      value: voteFilters.voted,
      className: 'voted',
    }, {
      name: t('Not voted'),
      value: voteFilters.notVoted,
      className: 'not-voted',
    }] : []),
    ],
    active: filters.tab,
    onClick: ({ value }) => applyFilters({ tab: value }),
  };

  const onRowClick = votingModeEnabled ? voteToggled : undefined;
  const canLoadMore = delegates.data.length >= votingConst.numberOfActiveDelegates;

  return (
    <FirstTimeVotingOverlay enabled={firstTimeVotingActive}>
      <DelegatesTableMain {...{
        delegates,
        tabs,
        applyFilters,
        filters,
        onRowClick,
        canLoadMore,
        t,
        firstTimeVotingActive,
        shouldShowVoteColumn,
      }}
      />
    </FirstTimeVotingOverlay>
  );
};

export default withDelegatesData()(DelegatesTable);
