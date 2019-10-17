import { withTranslation } from 'react-i18next';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { DEFAULT_LIMIT } from '../../../../constants/monitor';
import { formatAmountBasedOnLocale } from '../../../../utils/formattedNumber';
import AccountVisualWithAddress from '../../../shared/accountVisualWithAddress';
import DelegatesTable from '../../../shared/delegatesTable';
import MonitorHeader from '../header';

const Delegates = ({
  delegates, t, filters, applyFilters,
}) => {
  const columns = [
    { id: 'rank' },
    {
      id: 'username',
      header: ('Name'),
      className: grid['col-xs-2'],
    },
    {
      id: 'address',
      header: t('Address'),
      /* eslint-disable-next-line react/display-name */
      getValue: ({ address }) => <AccountVisualWithAddress {...{ address }} />,
      className: [grid['col-xs-5'], grid['col-md-6']].join(' '),
    },
    { id: 'productivity' },
    {
      id: 'approval',
      header: t('Approval'),
      getValue: ({ approval }) => `${formatAmountBasedOnLocale({ value: approval })} %`,
      className: grid['col-xs-2'],
    },
  ];

  const tabs = {
    tabs: [
      {
        value: 'active',
        name: ('Active delegates'),
        className: 'active',
      }, {
        value: 'standby',
        name: ('Standby delegates'),
        className: 'standby',
      },
    ],
    active: filters.tab,
    onClick: ({ value }) => applyFilters({ ...filters, tab: value }),
  };

  const canLoadMore = filters.tab === 'active'
    ? false
    : !!delegates.data.length && delegates.data.length % DEFAULT_LIMIT === 0;

  return (
    <div>
      <MonitorHeader />
      <DelegatesTable {...{
        columns, delegates, tabs, filters, applyFilters, canLoadMore,
      }}
      />
    </div>
  );
};

export default withTranslation()(Delegates);
