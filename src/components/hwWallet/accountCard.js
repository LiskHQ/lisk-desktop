import React from 'react';
import { translate } from 'react-i18next';
import { fromRawLsk } from '../../utils/lsk';
import ToolBoxInput from '../toolbox/inputs/toolBoxInput';
import AccountVisual from '../accountVisual';
import CopyToClipboard from '../copyToClipboard';
import keyCodes from './../../constants/keyCodes';

import styles from './accountCard.css';

const AccountCard = ({
  account, hardwareAccountName, isEditMode,
  changeInput, onClickHandler, index, saveAccountNames,
}) => (
  <div
    className={styles.card}
    onClick={() => {
      onClickHandler(account, index);
    }}>
    <div className={`${styles.accountVisualWrapper} accountVisualWrapper`}>
      <AccountVisual
        address={account.address}
        size={100} sizeS={60}
      />
    </div>
    <div className={styles.balance}>
      {fromRawLsk(account.balance)}<p>LSK</p>
    </div>
    {isEditMode ?
      <div
        className={styles.edit}
        onClick={/* istanbul ignore next */(e) => {
          e.stopPropagation();
        }}>
        <ToolBoxInput
          placeholder={'Title'}
          onChange={value => changeInput(value, account.address)}
          theme={styles}
          onKeyDown={/* istanbul ignore next */(event) => {
            if (event.keyCode === keyCodes.enter) saveAccountNames();
          }}
          value={hardwareAccountName}></ToolBoxInput>
      </div> :
      null}
      {hardwareAccountName && !isEditMode ?
        <div className={`${styles.edit} ${styles.editTitle}`}>
          {hardwareAccountName}
        </div> :
        null}
    <div className={styles.addressField}>
      <CopyToClipboard value={account.address} />
    </div>
  </div>
);

export default translate()(AccountCard);
