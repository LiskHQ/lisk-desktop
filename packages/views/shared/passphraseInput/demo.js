import React from 'react';
import DemoRenderer from '@basics/demoRenderer';
import PassphraseInput from '.';

/* eslint-disable-next-line no-console */
const onFill = console.log;

const PassphraseInputDemo = () => (
  <div>
    <h2>PassphraseInput</h2>
    <DemoRenderer>
      <PassphraseInput
        inputsLength={12}
        maxInputsLength={24}
        onFill={onFill}
      />
    </DemoRenderer>
  </div>
);

export default PassphraseInputDemo;
