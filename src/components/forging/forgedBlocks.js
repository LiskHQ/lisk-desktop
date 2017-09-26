import React from 'react';
import { Card, CardTitle } from 'react-toolbox/lib/card';
import { Table, TableHead, TableRow, TableCell } from 'react-toolbox/lib/table';
import { translate } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { TooltipTime } from '../timestamp';
import LiskAmount from '../liskAmount';
import FormattedNumber from '../formattedNumber';
import style from './forging.css';


const ForgedBlocks = props => (
  <Card className={`${style.grayCard} ${grid['col-xs-12']} forged-blocks`}>
    <CardTitle>
      Forged Blocks
    </CardTitle>
    { props.forgedBlocks.length ?
      <div className={style.forgedBlocksTableWrapper}>
        <Table selectable={false}>
          <TableHead>
            <TableCell>{props.t('Block height')}</TableCell>
            <TableCell>{props.t('Block Id')}</TableCell>
            <TableCell>{props.t('Timestamp')}</TableCell>
            <TableCell>{props.t('Total fee')}</TableCell>
            <TableCell>{props.t('Reward')}</TableCell>
          </TableHead>
          {props.forgedBlocks.map((block, idx) => (
            <TableRow key={idx}>
              <TableCell><FormattedNumber val={block.height} /></TableCell>
              <TableCell>{block.id}</TableCell>
              <TableCell><TooltipTime label={block.timestamp} /></TableCell>
              <TableCell><LiskAmount val={block.totalFee} roundTo={2} /></TableCell>
              <TableCell><LiskAmount val={block.reward} roundTo={2} /></TableCell>
            </TableRow>
          ))}
        </Table>
      </div> :
      <p className='hasPaddingRow empty-message'>{props.t('You have not forged any blocks yet')}.</p>
    }
  </Card>
);

export default translate()(ForgedBlocks);
