import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Table from '@basics/table';
import Box from '@basics/box';
import BoxHeader from '@basics/box/header';
import BoxContent from '@basics/box/content';
import GroupRow from './groupRow';
import styles from './multiSignature.css';

const header = t => (
  [
    {
      title: t('Group'),
      classList: grid['col-xs-8'],
    },
    {
      title: t('Balance'),
      classList: grid['col-xs-4'],
    },
  ]
);

const GroupTable = ({ t, groups }) => (
  <Box>
    <BoxHeader>
      <h2>{t('Your multisignatures groups')}</h2>
    </BoxHeader>
    <BoxContent className={`${styles.tableContent} multisign-groups-table`}>
      <Table
        data={groups}
        row={GroupRow}
        header={header(t)}
      />
    </BoxContent>
  </Box>
);

export default GroupTable;
