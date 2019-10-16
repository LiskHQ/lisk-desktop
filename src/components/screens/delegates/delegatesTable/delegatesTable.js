import { Link } from 'react-router-dom';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { getTotalVotesCount } from '../../../../utils/voting';
import { tokenMap } from '../../../../constants/tokens';
import AvatarWithNameAndAddress from '../../../shared/avatarWithNameAndAddress';
import LiskAmount from '../../../shared/liskAmount';
import ShaderDelegatesTable from '../../../shared/delegatesTable';
import Tooltip from '../../../toolbox/tooltip/tooltip';
import VoteCheckbox from './voteCheckbox';
import routes from '../../../../constants/routes';
import voteFilters from '../../../../constants/voteFilters';
import withDelegatesData from './withDelegatesData';
import styles from './delegatesTable.css';

const DelegatesTable = ({
  t, delegates, filters, applyFilters, votingModeEnabled, votes, voteToggled, account,
}) => {
  const shouldShowVoteColumn = votingModeEnabled || getTotalVotesCount(votes) > 0;
  const columns = [
    ...(shouldShowVoteColumn ? [{
      id: 'voteStatus',
      header: t('Vote'),
      className: grid['col-xs-1'],
      /* eslint-disable-next-line react/display-name */
      getValue: delegate => (
        <VoteCheckbox {...{
          delegate, votingModeEnabled, toggle: voteToggled,
        }}
        />
      ),
    }] : []),
    { id: 'rank' },
    {
      id: 'delegate',
      header: t('Delegate'),
      /* eslint-disable-next-line react/display-name */
      getValue: delegate => (
        <Link
          className={styles.delegateLink}
          to={`${routes.accounts.pathPrefix}${routes.accounts.path}/${delegate.account.address}`}
        >
          <AvatarWithNameAndAddress {...delegate} />
        </Link>
      ),
      className: shouldShowVoteColumn
        ? [grid['col-xs-4'], grid['col-md-5']].join(' ')
        : [grid['col-xs-5'], grid['col-md-6']].join(' '),
    },
    { id: 'rewards' },
    { id: 'productivity' },
    {
      id: 'vote',
      header: <React.Fragment>
        {t('Vote weight')}
        <Tooltip className="showOnLeft">
          <p>{t('Sum of LSK in all accounts who have voted for this delegate.')}</p>
        </Tooltip>
      </React.Fragment>,
      /* eslint-disable-next-line react/display-name */
      getValue: ({ vote }) => (
        <strong><LiskAmount val={vote} roundTo={0} token={tokenMap.LSK.key} /></strong>
      ),
      className: grid['col-xs-2'],
    },
  ];
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

  return (
    <ShaderDelegatesTable {...{
      columns, delegates, tabs, applyFilters, filters,
    }}
    />
  );
};

export default withDelegatesData()(DelegatesTable);
