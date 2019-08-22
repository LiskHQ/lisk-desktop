import React from 'react';
import AutoSuggest from '.';
import DemoRenderer from '../demoRenderer';

export default function AutoSuggestDemo() {
  return (
    <div>
      <h2>AutoSuggest</h2>
      <DemoRenderer>
        <AutoSuggest
          recipient={{
            address: '124124L',
            value: '',
          }}
          placeholder=""
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
          onChange={() => {}}
          onSelectedAccount={() => {}}
        />
      </DemoRenderer>
    </div>
  );
}
