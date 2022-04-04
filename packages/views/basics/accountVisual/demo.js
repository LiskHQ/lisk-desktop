import React, { useState } from 'react';
import Waypoint from 'react-waypoint';
import { extractAddressFromPassphrase } from '@wallet/utilities/account';
import { generatePassphraseFromSeed } from '@common/utilities/passphrase';
import AccountVisual from '.';
import DemoRenderer from '../demoRenderer';

/**
 * Ignored the unit test coverage of this component
 * since it's developed for demonstration purpose only
 */
/* istanbul ignore next */
const AccountVisualDemo = () => {
  const loadMore = (acc) => {
    const offset = acc.length;
    const bytes = [];
    for (let j = 1 + offset; j <= 152 + offset; j += 1) {
      const crypotObj = window.crypto || window.msCrypto;
      const byte = [...crypotObj.getRandomValues(new Uint16Array(16))].map(x => (`00${(x % 256).toString(16)}`).slice(-2));
      bytes.push(byte);
    }

    const generateAccounts = bytes.map(seed => generatePassphraseFromSeed({ seed }))
      .map(extractAddressFromPassphrase);

    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }
    return [...acc, ...generateAccounts].filter(onlyUnique);
  }

  const [accounts, setAccounts] = useState(loadMore([]))
  const size = 88;

  return (
    <div>
      <h2>AccountVisual</h2>
      <div style={{ whiteSpace: 'no-break' }}>
        {accounts.map(account => (
          <DemoRenderer
            key={account}
            style={{
              display: 'inline-block',
              overflow: 'hidden',
              wordBreak: 'break-all',
              textAlign: 'center',
              width: size * 2,
              padding: 10,
              fontSize: 14,
            }}
          >
            <AccountVisual size={size} address={account} />
          </DemoRenderer>
        ))}
      </div>
      <Waypoint onEnter={() => {
        setAccounts(loadMore(accounts));
      }}
      />
    </div>
  );
}

export default AccountVisualDemo;
