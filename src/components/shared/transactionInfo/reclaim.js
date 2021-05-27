import React from 'react';
import AccountMigration from '@shared/accountMigration';
import LiskAmount from '@shared/liskAmount';
import { tokenMap } from '@constants';

const Reclaim = ({ account, t }) => (
  <>
    <section>
      <AccountMigration account={account.info.LSK} showBalance={false} />
    </section>
    <section>
      <label>{t('Balance to reclaim')}</label>
      <LiskAmount
        val={Number(account.info.LSK.legacy.balance)}
        token={tokenMap.LSK.key}
      />
    </section>
  </>
);

export default Reclaim;
