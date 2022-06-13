import React from 'react';
import MigrationDetails from '@legacy/components/migrationDetails';
import TokenAmount from '@token/fungible/components/tokenAmount';
import { tokenMap } from '@token/fungible/consts/tokens';

const Reclaim = ({ account, t }) => (
  <>
    <section>
      <MigrationDetails wallet={account} showBalance={false} />
    </section>
    <section>
      <label>{t('Balance to reclaim')}</label>
      <TokenAmount
        val={Number(account.legacy.balance)}
        token={tokenMap.LSK.key}
      />
    </section>
  </>
);

export default Reclaim;
