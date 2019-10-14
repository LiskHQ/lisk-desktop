import { withTranslation } from 'react-i18next';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { Input } from '../../toolbox/inputs';
import { formatAmountBasedOnLocale } from '../../../utils/formattedNumber';
import { tokenMap } from '../../../constants/tokens';
import Box from '../../toolbox/box';
import LiskAmount from '../liskAmount';
import Table from '../../toolbox/table';

const DelegatesTable = ({
  columns, delegates, tabs, t,
}) => {
  const data = delegates.data.map(d => ({ ...d, id: d.username }));

  const columnDefaults = {
    rank: {
      header: t('Rank'),
      getValue: ({ rank }) => `#${rank}`,
      className: grid['col-xs-1'],
    },
    forged: {
      header: t('Forged'),
      /* eslint-disable-next-line react/display-name */
      getValue: ({ forged }) => <LiskAmount val={forged} token={tokenMap.LSK.key} />,
      className: grid['col-xs-2'],
    },
    productivity: {
      header: t('Rank'),
      getValue: ({ productivity }) => `${formatAmountBasedOnLocale({ value: productivity })} %`,
      className: grid['col-xs-2'],
    },
  };
  columns = columns.map(c => ({ ...columnDefaults[c.id], ...c }));

  return (
    <Box>
      <Box.Header>
        <Box.Tabs {...{ tabs }} />
        <span>
          <Input size="xs" placeholder={t('Filter by name...')} />
        </span>
      </Box.Header>
      <Box.Content>
        <Table {...{ columns, data }} />
      </Box.Content>
    </Box>
  );
};

export default withTranslation()(DelegatesTable);
