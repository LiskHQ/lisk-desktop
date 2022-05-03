import React from 'react';
import MigrationDetails from '@legacy/components/migrationDetails';
import LiskAmount from '@shared/liskAmount';
import { tokenMap } from '@token/fungible/consts/tokens';

const Reclaim = ({ account, t }) => (
  <>
    <section>
      <MigrationDetails wallet={account.info.LSK} showBalance={false} />
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
