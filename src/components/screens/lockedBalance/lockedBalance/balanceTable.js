import React from 'react';
import { withTranslation } from 'react-i18next';
import Icon from '../../../toolbox/icon';
import LiskAmount from '../../../shared/liskAmount';
import { tokenMap } from '../../../../constants/tokens';
import UnlockingList from './unlockingList';
import styles from './lockedBalance.css';

const BalanceTable = ({
  t,
  lockedBalance,
  availableBalance,
  currentBlock,
  account,
}) => (
  <ul className={`${styles.amountStatusContainer} lock-balance-amount-container`}>
    {(lockedBalance !== 0 || account.unlocking.length > 0 || availableBalance !== 0)
      && (
      <li>
        <p className={styles.columnTitle}>{t('Amount')}</p>
        <p className={styles.columnTitle}>{t('Status')}</p>
      </li>
      )
    }
    {lockedBalance !== 0
      && (
        <li>
          <p className="locked-balance">
            <LiskAmount val={lockedBalance} token={tokenMap.LSK.key} />
          </p>
          <p>
            <Icon name="lock" />
            {t('locked')}
          </p>
        </li>
      )
    }
    {account.unlocking.length > 0
      && <UnlockingList account={account} currentBlock={currentBlock} t={t} />
    }
    {availableBalance !== 0
      && (
      <li>
        <p className="available-balance">
          <LiskAmount val={availableBalance} token={tokenMap.LSK.key} />
        </p>
        <p>
          <Icon name="unlock" />
          {t('available to unlock')}
        </p>
      </li>
      )
    }
  </ul>
);

export default withTranslation()(BalanceTable);
