import React from 'react';
import Waypoint from 'react-waypoint';

import { generatePassphraseFromSeed } from '../../utils/passphrase';
import { extractAddress } from '../../utils/account';
import AccountVisual from '.';
import Box from '../box';

/**
 * Ignored the unit test coverage of this component
 * since it's developed for demonstration purpose only
 */
/* istanbul ignore next */
class AccountVisualDemo extends React.Component {
  constructor() {
    super();
    this.state = {
      accounts: this.loadMore([]),
    };
  }

  // eslint-disable-next-line class-methods-use-this
  loadMore(acc) { // eslint-disable-line max-statements
    const offset = acc.length;
    const bytes = [];
    for (let j = 1 + offset; j <= 152 + offset; j += 1) {
      const crypotObj = window.crypto || window.msCrypto;
      const byte = [...crypotObj.getRandomValues(new Uint16Array(16))].map(x => (`00${(x % 256).toString(16)}`).slice(-2));
      bytes.push(byte);
    }

    const accounts = bytes.map(seed => generatePassphraseFromSeed({ seed }))
      .map(extractAddress);

    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }
    return [...acc, ...accounts].filter(onlyUnique);
  }

  render() {
    const size = 88;

    return (
      <Box>
        <div style={{ whiteSpace: 'no-break' }}>
          {this.state.accounts.map(account => (
            <div
              key={account}
              style={{
                display: 'inline-block',
                overflow: 'hidden',
                wordBreak: 'break-all',
                width: size,
                padding: 20,
                fontSize: 14,
              }}
            >
              {account}
              <br />
              {' '}
              <br />
              <AccountVisual address={account} size={size} />
            </div>
          ))}
        </div>
        <Waypoint onEnter={() => {
          this.setState({
            accounts: this.loadMore(this.state.accounts),
          });
        }}
        />
      </Box>
    );
  }
}

export default AccountVisualDemo;
