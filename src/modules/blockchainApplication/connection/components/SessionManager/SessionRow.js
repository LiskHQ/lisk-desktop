import React from 'react';
import moment from 'moment';
import { truncateAddress } from '@wallet/utils/account';
import { TertiaryButton } from 'src/theme/buttons';
import tableStyles from '@theme/table/table.css';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import styles from './SessionManager.css';

const SessionRow = ({ data, t, disconnect }) => (
  <div
    key={data.topic}
    className={`connection ${styles.sessionRow} ${tableStyles.row} ${grid.row}`}
  >
    <div className={grid['col-xs-3']}>
      <span>{data.peerMetadata.name}</span>
    </div>
    <div className={grid['col-xs-3']}>
      <span>{moment(data.expiry * 1000).format('DD MMM YYYY')}</span>
    </div>
    <div className={grid['col-xs-4']}>
      <span>{truncateAddress(data.topic)}</span>
    </div>
    <div className={grid['col-xs-2']}>
      <TertiaryButton onClick={() => disconnect(data.topic)}>{t('Disconnect')}</TertiaryButton>
    </div>
  </div>
);

export default SessionRow;
