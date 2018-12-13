import React from 'react';
import { translate } from 'react-i18next';
import { fromRawLsk } from '../../utils/lsk';
import ToolBoxInput from '../toolbox/inputs/toolBoxInput';
import AccountVisual from '../accountVisual';
import CopyToClipboard from '../copyToClipboard';

import styles from './accountCard.css';

const AccountCard = ({
  account, hardwareAccountName, isEditMode,
  changeInput, onClickHandler, index,
}) => (
  <div className={styles.card}>
    <div
      className={styles.accountVisualWrapper}
      onClick={() => { onClickHandler(account, index); }}>
      <AccountVisual
        address={account.address}
        size={100} sizeS={60}
      />
    </div>
    <div className={styles.balance}>
      {fromRawLsk(account.balance)}<p>LSK</p>
    </div>
    {isEditMode
      ? <div className={styles.edit}>
        <ToolBoxInput
          placeholder={'Account Name'}
          onChange={value => changeInput(value, account.address)}
          theme={styles}
          value={hardwareAccountName}></ToolBoxInput>
      </div>
      : null}
      {hardwareAccountName && !isEditMode
        ? <div className={`${styles.edit} ${styles.editTitle}`}>
          {hardwareAccountName}
        </div>
        : null}
    <div className={styles.addressField}>
      <CopyToClipboard value={account.address} />
    </div>
  </div>
);

export default translate()(AccountCard);
