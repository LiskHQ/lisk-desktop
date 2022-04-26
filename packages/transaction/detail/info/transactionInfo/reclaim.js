import React from 'react';
import WalletMigration from '@legacy/detail/info/walletMigration';
import LiskAmount from '@shared/liskAmount';
import { tokenMap } from '@token/configuration/tokens';

const Reclaim = ({ account, t }) => (
  <>
    <section>
      <WalletMigration wallet={account.info.LSK} showBalance={false} />
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
