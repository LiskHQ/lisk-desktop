import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

import { tokenMap, MODULE_ASSETS_NAME_ID_MAP } from '@constants';
import { getTxAmount } from '@utils/api/transaction/lsk';
import { DateTimeFromTimestamp } from '@toolbox/timestamp';
import Icon from '@toolbox/icon';
import Tooltip from '@toolbox/tooltip/tooltip';
import DialogLink from '@toolbox/dialog/link';
import AccountVisualWithAddress from '../accountVisualWithAddress';
import LiskAmount from '../liskAmount';
import styles from './transactionsTable.css';

const roundSize = 103;

const TransactionRow = ({ data, className, t }) => (
  <DialogLink
    className={`${grid.row} ${className}`}
    component="transactionDetails"
    data={{ transactionId: data.id, token: tokenMap.LSK.key }}
  >
    <span className={grid['col-xs-3']}>
      <AccountVisualWithAddress
        address={data.sender.address}
        transactionSubject="sender"
        moduleAssetId={data.moduleAssetId}
        showBookmarkedAddress
      />
    </span>
    <span className={grid['col-xs-3']}>
      <AccountVisualWithAddress
        address={data.asset.recipientAddress}
        transactionSubject="recipient"
        moduleAssetId={data.moduleAssetId}
        showBookmarkedAddress
      />
    </span>
    <span className={grid['col-xs-2']}>
      <DateTimeFromTimestamp time={data.block.timestamp * 1000} token={tokenMap.BTC.key} />
    </span>
    <span className={`${grid['col-xs-3']} ${grid['col-md-2']} ${styles.amount}`}>
      <LiskAmount
        val={getTxAmount(data)}
        token={tokenMap.LSK.key}
      />
      <span className={`${styles.fee} hideOnLargeViewPort`}>
        <LiskAmount val={data.fee} token={tokenMap.LSK.key} />
      </span>
    </span>
    <span className={`${grid['col-md-1']} ${styles.transactionFeeCell}`}>
      <Tooltip
        title={t('Transaction')}
        position="bottom"
        tooltipClassName={`${styles.tooltip} ${styles.tooltipOffset}`}
        content={<LiskAmount val={data.fee} token={tokenMap.LSK.key} />}
        size="s"
      >
        <p>{`${data.type} - ${MODULE_ASSETS_NAME_ID_MAP[data.moduleAssetId]}`}</p>
      </Tooltip>
    </span>
    <span className={grid['col-xs-1']}>
      <Tooltip
        title={data.isPending ? t('Pending') : t('Confirmed')}
        position="left"
        tooltipClassName={`${styles.tooltip} ${styles.tooltipOffset}`}
        content={<Icon name={data.isPending ? 'pending' : 'approved'} />}
        size="s"
      >
        <p>{`${data.block.height}/${roundSize} ${t('Confirmations')}`}</p>
      </Tooltip>
    </span>
  </DialogLink>
);

/* istanbul ignore next */
const areEqual = (prevProps, nextProps) =>
  (prevProps.data.id === nextProps.data.id
  && prevProps.data.confirmations === nextProps.data.confirmations);

export default React.memo(TransactionRow, areEqual);
