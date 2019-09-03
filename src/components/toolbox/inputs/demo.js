import React from 'react';
import DemoRenderer, { DarkWrapper } from '../demoRenderer';
import { Input, AutoresizeTextarea } from '.';
import Feedback from '../feedback/feedback';

/* eslint-disable-next-line no-console */
const onChange = console.log;

const InputsDemo = () => (
  <div>
    <h2>Input</h2>
    <DemoRenderer>
      <Input
        onChange={onChange}
        value=""
        placeholder="Input demo placeholder (default: size L)"
      />
      <Input
        size="m"
        onChange={onChange}
        value=""
        placeholder="Input demo placeholder (size M)"
      />
      <Input
        size="s"
        onChange={onChange}
        value=""
        placeholder="Input demo placeholder (size S)"
      />
      <Input
        size="xs"
        onChange={onChange}
        value=""
        placeholder="Input demo placeholder (size XS)"
      />
    </DemoRenderer>
    <DemoRenderer>
      <Input
        onChange={onChange}
        name="demo"
        value="ok value"
        status="ok"
      />
      <Input
        onChange={onChange}
        name="demo"
        value="validating..."
        status="pending"
      />
      <Input
        onChange={onChange}
        name="demo"
        value="0alkawja;jk"
        status="error"
      />
      {/* TODO fix Input to accept props.error='<message>' so that next line is not needed */}
      <Feedback
        show
        status="error"
        showIcon
      >
        There was something wrong typed.
      </Feedback>
    </DemoRenderer>
    <DemoRenderer>
      <DarkWrapper>
        {/* TODO fix Input to change to dark mode when props.dark={true} */}
        <Input
          onChange={onChange}
          name="demo"
          value="ok value"
          status="ok"
        />
        <Input
          onChange={onChange}
          name="demo"
          value="validating..."
          status="pending"
        />
        <Input
          onChange={onChange}
          name="demo"
          value="0alkawja;jk"
          status="error"
        />
        <Feedback
          dark
          show
          status="error"
          showIcon
        >
          There was something wrong typed.
        </Feedback>
      </DarkWrapper>
    </DemoRenderer>
    <DemoRenderer>
      <AutoresizeTextarea
        name="shareLink"
        value="text in the text area"
        className="whatever"
        readOnly
      />
    </DemoRenderer>
  </div>
);

export default InputsDemo;
