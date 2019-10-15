import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { tokenMap } from '../../../../constants/tokens';
import AccountVisual from '../../../toolbox/accountVisual';
import LiskAmount from '../../../shared/liskAmount';
import ShaderDelegatesTable from '../../../shared/delegatesTable';
import voteFilters from '../../../../constants/voteFilters';
import withDelegatesData from './withDelegatesData';

const AvatarWithNameAndAddress = ({ username, account: { address } }) => (
  <div>
    <AccountVisual size={36} address={address} />
    <span>
      <div>{username}</div>
      <div>{address}</div>
    </span>
  </div>
);

const DelegatesTable = ({
  t, delegates, filters, applyFilters,
}) => {
  const columns = [
    { id: 'rank' },
    {
      id: 'delegate',
      header: t('Delegate'),
      getValue: AvatarWithNameAndAddress,
      className: grid['col-xs-5'],
    },
    { id: 'rewards' },
    { id: 'productivity' },
    {
      id: 'vote',
      header: t('Vote weight'),
      /* eslint-disable-next-line react/display-name */
      getValue: ({ vote }) => <LiskAmount val={vote} token={tokenMap.LSK.key} />,
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
    onClick: ({ value }) => applyFilters({ tab: value }),
  };

  return (
    <ShaderDelegatesTable {...{ columns, delegates, tabs }} />
  );
};

export default withDelegatesData()(DelegatesTable);
