import React from 'react';
import Waypoint from 'react-waypoint';
import { extractAddressFromPassphrase } from '@common/utilities/account';
import { generatePassphraseFromSeed } from '@common/utilities/passphrase';
import AccountVisual from '.';
import DemoRenderer from '../demoRenderer';

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
      .map(extractAddressFromPassphrase);

    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }
    return [...acc, ...accounts].filter(onlyUnique);
  }

  render() {
    const size = 88;

    return (
      <div>
        <h2>AccountVisual</h2>
        <div style={{ whiteSpace: 'no-break' }}>
          {this.state.accounts.map(account => (
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
          this.setState({
            accounts: this.loadMore(this.state.accounts),
          });
        }}
        />
      </div>
    );
  }
}

export default AccountVisualDemo;
