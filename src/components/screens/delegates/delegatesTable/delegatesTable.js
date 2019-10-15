import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { getTotalVotesCount } from '../../../../utils/voting';
import { tokenMap } from '../../../../constants/tokens';
import AvatarWithNameAndAddress from '../../../shared/avatarWithNameAndAddress';
import LiskAmount from '../../../shared/liskAmount';
import ShaderDelegatesTable from '../../../shared/delegatesTable';
import Tooltip from '../../../toolbox/tooltip/tooltip';
import VoteCheckbox from '../delegatesListView/voteCheckbox';
import voteFilters from '../../../../constants/voteFilters';
import withDelegatesData from './withDelegatesData';

const DelegatesTable = ({
  t, delegates, filters, applyFilters, votingModeEnabled, votes, voteToggled,
}) => {
  const shouldShowVoteColumn = votingModeEnabled || getTotalVotesCount(votes) > 0;
  const columns = [
    ...(shouldShowVoteColumn ? [{
      id: 'voteStatus',
      header: t('Vote'),
      className: grid['col-xs-1'],
      /* eslint-disable-next-line react/display-name */
      getValue: data => (
        <VoteCheckbox {...{
          data, status: data.voteStatus, votingModeEnabled, toggle: voteToggled,
        }}
        />
      ),
    }] : []),
    { id: 'rank' },
    {
      id: 'delegate',
      header: t('Delegate'),
      getValue: AvatarWithNameAndAddress,
      className: shouldShowVoteColumn ? grid['col-xs-4'] : grid['col-xs-5'],
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
      getValue: ({ vote }) => <strong><LiskAmount val={vote} token={tokenMap.LSK.key} /></strong>,
      className: grid['col-xs-2'],
    },
  ];
  const tabs = {
    tabs: [{
      name: t('All delegates'),
      value: voteFilters.all,
      className: 'all-delegates',
    }, {
      name: t('Voted'),
      value: voteFilters.voted,
      className: 'voted',
    }, {
      name: t('Not voted'),
      value: voteFilters.notVoted,
      className: 'not-voted',
    }],
    active: filters.tab,
    onClick: ({ value }) => applyFilters({ tab: value, search: '' }),
  };

  return (
    <ShaderDelegatesTable {...{
      columns, delegates, tabs, applyFilters, filters,
    }}
    />
  );
};

export default withDelegatesData()(DelegatesTable);
