/* istanbul ignore file */
import React from 'react';
import DemoRenderer from 'src/theme/demo/demoRenderer';
import AutoSuggest from './index';

/* eslint-disable-next-line no-console */
const onChange = console.log;

export default class AutoSuggestDemo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      address: '',
      value: '',
    };

    this.onChange = this.onChange.bind(this);
    this.onSelectItem = this.onSelectItem.bind(this);
  }

  onSelectItem(account) {
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
            selectedItem={{
              address,
              value,
            }}
            placeholder="Start typing..."
            token="LSK"
            items={[
              {
                title: '#1',
                address: '214986124L',
              },
              {
                title: '#2',
                address: '7124124L',
              },
            ]}
            matchProps={['address', 'title']}
            onChangeDelayed={onChange}
            onChange={this.onChange}
            onSelectItem={this.onSelectItem}
            renderItem={(item) => (
              <>
                <span>{item.title}</span>
                <span>{item.address}</span>
              </>
            )}
          />
        </DemoRenderer>
      </div>
    );
  }
}
