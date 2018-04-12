import React from 'react';
import Waypoint from 'react-waypoint';

import { generatePassphrase } from '../../utils/passphrase';
import { extractAddress } from '../../utils/api/account';
import AccountVisual from '../accountVisual';
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
  loadMore(acc) {
    const offset = acc.length;
    const bytes = [];
    for (let j = 1 + offset; j <= 152 + offset; j += 1) {
      const byte = [];
      for (let i = 1; i <= 16; i += 1) {
        byte.push(((j + i) % i) % 2);
      }
      bytes.push(byte);
    }
    let accounts = bytes.map(seed => generatePassphrase({ seed }))
      .map(extractAddress);

    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }
    accounts = [...acc, ...accounts].filter(onlyUnique);
    return accounts;
  }

  render() {
    const size = 88;

    return (
      <Box>
        <div style={{ whiteSpace: 'no-break' }}>
          {this.state.accounts.map(account => (
            <div key={account}
              style={{
                display: 'inline-block',
                overflow: 'hidden',
                wordBreak: 'break-all',
                width: size,
                padding: 20,
                fontSize: 14,
              }}>
              {account}<br /> <br />
              <AccountVisual address={account} size={size} />
            </div>
          ))}
        </div>
        <Waypoint onEnter={() => {
          this.setState({
            accounts: this.loadMore(this.state.accounts),
          });
        }}></Waypoint>
      </Box>
    );
  }
}

export default AccountVisualDemo;
