import React from 'react';
import TransactionsTable from './transactionsTable';

const MultiSignature = ({ t, host }) => (
  <section>
    {/* TODO add multisignature groups */}
    <TransactionsTable
      t={t}
      host={host}
      transactions={[
        {
          sender: { address: '7775299921311136181L', publicKey: '8155694652104526882', title: 'Wilson Geidt' },
          recipient: { address: '6195226421328336181L' },
          amount: 10000000000,
          status: 1,
        },
        {
          sender: { address: '6195226421328336181L' },
          recipient: { address: '5059876081639179984L' },
          amount: 2000000000,
          status: 2,
        },
        {
          sender: { address: '5195226421328336181L' },
          recipient: { address: '1295226421328336181L' },
          amount: 50000000000,
          status: 3,
        },
      ]}
    />
  </section>
);

export default MultiSignature;
