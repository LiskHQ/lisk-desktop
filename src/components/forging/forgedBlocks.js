import React from 'react';
import { Card, CardTitle } from 'react-toolbox/lib/card';
import { translate } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { TooltipTime } from '../timestamp';
import LiskAmount from '../liskAmount';
import FormattedNumber from '../formattedNumber';
import style from './forging.css';
import { TBTable, TBTableHead, TBTableRow, TBTableCell } from '../toolbox/tables/table';


const ForgedBlocks = props => (
  <Card className={`${style.grayCard} ${grid['col-xs-12']} forged-blocks`}>
    <CardTitle>
      Forged Blocks
    </CardTitle>
    { props.forgedBlocks.length ?
      <div className={style.forgedBlocksTableWrapper}>
        <TBTable selectable={false}>
          <TBTableHead>
            <TBTableCell>{props.t('Block height')}</TBTableCell>
            <TBTableCell>{props.t('Block Id')}</TBTableCell>
            <TBTableCell>{props.t('Timestamp')}</TBTableCell>
            <TBTableCell>{props.t('Total fee')}</TBTableCell>
            <TBTableCell>{props.t('Reward')}</TBTableCell>
          </TBTableHead>
          {props.forgedBlocks.map((block, idx) => (
            <TBTableRow key={idx}>
              <TBTableCell><FormattedNumber val={block.height} /></TBTableCell>
              <TBTableCell>{block.id}</TBTableCell>
              <TBTableCell><TooltipTime label={block.timestamp} /></TBTableCell>
              <TBTableCell><LiskAmount val={block.totalFee} roundTo={2} /></TBTableCell>
              <TBTableCell><LiskAmount val={block.reward} roundTo={2} /></TBTableCell>
            </TBTableRow>
          ))}
        </TBTable>
      </div> :
      <p className='hasPaddingRow empty-message'>{props.t('You have not forged any blocks yet')}.</p>
    }
  </Card>
);

export default translate()(ForgedBlocks);
