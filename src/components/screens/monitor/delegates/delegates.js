import { withTranslation } from 'react-i18next';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { formatAmountBasedOnLocale } from '../../../../utils/formattedNumber';
import DelegatesTable from '../../../shared/delegatesTable';
import MonitorHeader from '../header';

const AvatarWithAddress = ({ address }) => (
  <React.Fragment>
    {address}
  </React.Fragment>
);

const Delegates = ({
  delegates, t, filters, applyFilters,
}) => {
  const columns = [
    { id: 'rank' },
    {
      id: 'username',
      header: ('Name'),
      className: grid['col-xs-1'],
    },
    {
      id: 'address',
      header: t('Address'),
      getValue: AvatarWithAddress,
      className: grid['col-xs-4'],
    },
    { id: 'rewards' },
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
        value: '/active',
        name: ('Active delegates'),
      }, {
        value: '/standby',
        name: ('Standby delegates'),
      },
    ],
    active: filters.tab,
    onClick: ({ value }) => applyFilters({ tab: value }),
  };

  return (
    <div>
      <MonitorHeader />
      <DelegatesTable {...{
        columns, delegates, tabs, filters, applyFilters,
      }}
      />
    </div>
  );
};

export default withTranslation()(Delegates);
