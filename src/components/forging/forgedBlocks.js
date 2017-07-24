import React from 'react';
import { Card, CardTitle } from 'react-toolbox/lib/card';
import { Table, TableHead, TableRow, TableCell } from 'react-toolbox/lib/table';
import { TooltipTime } from '../timestamp';
import LiskAmount from '../liskAmount';
import FormattedNumber from '../formattedNumber';
import grid from '../../../node_modules/flexboxgrid/dist/flexboxgrid.css';
import style from './forging.css';


const ForgedBlocks = props => (
  <Card className={`${style.grayCard} ${grid['col-xs-12']}`}>
    <CardTitle>
      Forged Blocks
    </CardTitle>
    <div className={style.forgedBlocksTableWrapper}>
      <Table selectable={false}>
        <TableHead>
          <TableCell>Block height</TableCell>
          <TableCell>Block Id</TableCell>
          <TableCell>Timestamp</TableCell>
          <TableCell>Total fee</TableCell>
          <TableCell>Reward</TableCell>
        </TableHead>
        {props.forgedBlocks.map((block, idx) => (
          <TableRow key={idx}>
            <TableCell><FormattedNumber val={block.height} /></TableCell>
            <TableCell>{block.id}</TableCell>
            <TableCell><TooltipTime label={block.timestamp} /></TableCell>
            <TableCell><LiskAmount val={block.totalFee} /></TableCell>
            <TableCell><LiskAmount val={block.reward} /></TableCell>
          </TableRow>
        ))}
      </Table>
    </div>
  </Card>
);

export default ForgedBlocks;
