import React from 'react';
import AutoSuggest from '.';
import DemoRenderer from '../demoRenderer';

export default class AutoSuggestDemo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      address: '',
      value: '',
    };

    this.onChange = this.onChange.bind(this);
    this.onSelectedAccount = this.onSelectedAccount.bind(this);
  }

  onSelectedAccount(account) {
    this.setState({
      value: account.title,
      address: account.address,
    });
  }

  onChange({ target }) {
    this.setState({
      value: target.value,
    });
  }

  render() {
    const { value, address } = this.state;
    return (
      <div>
        <h2>AutoSuggest</h2>
        <DemoRenderer>
          <AutoSuggest
            recipient={{
              address,
              value,
            }}
            placeholder="Start typing..."
            token="LSK"
            bookmarks={{
              LSK: [{
                title: '#1',
                address: '214986124L',
              }, {
                title: '#2',
                address: '7124124L',
              }],
            }}
            validateBookmark={() => true}
            onChange={this.onChange}
            onSelectedAccount={this.onSelectedAccount}
          />
        </DemoRenderer>
      </div>
    );
  }
}
