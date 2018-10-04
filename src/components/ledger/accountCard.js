import React from 'react';
import { translate } from 'react-i18next';
import { fromRawLsk } from '../../utils/lsk';
import AccountVisual from '../accountVisual';
import CopyToClipboard from '../copyToClipboard';

import styles from './accountCard.css';

const AccountCard = ({ account, onClickHandler }) => (
  <div className={styles.card} onClick={() => { onClickHandler(account); }}>
    <div className={styles.accountVisualWrapper}>
      <AccountVisual
        address={account.address}
        size={100} sizeS={60}
      />
    </div>
    <div className={styles.balance}>
      {`${fromRawLsk(account.balance)} LSK`}
    </div>
    <div className={styles.addressField}>
      <CopyToClipboard value={account.address} />
    </div>
  </div>
);

export default translate()(AccountCard);
