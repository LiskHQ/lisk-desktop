import React from 'react';
import DemoRenderer, { DarkWrapper } from '../demoRenderer';
import { InputV2, AutoresizeTextarea } from '.';
import Feedback from '../feedback/feedback';
import Icon from '../icon';
import SpinnerV2 from '../../spinnerV2/spinnerV2';

/* eslint-disable-next-line no-console */
const onChange = console.log;

const InputsDemo = () => (
  <div>
    <h2>InputV2</h2>
    <DemoRenderer>
      <InputV2
        onChange={onChange}
        value=""
        placeholder="Input demo placeholder (default: size L)"
      />
      <InputV2
        size="m"
        onChange={onChange}
        value=""
        placeholder="Input demo placeholder (size M)"
      />
      <InputV2
        size="s"
        onChange={onChange}
        value=""
        placeholder="Input demo placeholder (size S)"
      />
      <InputV2
        size="xs"
        onChange={onChange}
        value=""
        placeholder="Input demo placeholder (size XS)"
      />
    </DemoRenderer>
    <DemoRenderer>
      <InputV2
        onChange={onChange}
        name="demo"
        value="ok value"
      />
      {/* TODO fix InputV2 to accept props.status='ok' so that next line is not needed */}
      <Icon name="ok_icon" />
      <InputV2
        onChange={onChange}
        name="demo"
        value="validating..."
      />
      {/* TODO fix InputV2 to accept props.status='pending' so that next line is not needed */}
      <SpinnerV2 />
      <InputV2
        onChange={onChange}
        name="demo"
        value="0alkawja;jk"
        className="error"
      />
      {/* TODO fix InputV2 to accept props.status='error' so that next line is not needed */}
      <Icon name="alert_icon" />
      {/* TODO fix InputV2 to accept props.error='<message>' so that next line is not needed */}
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
        {/* TODO fix InputV2 to change to dark mode when props.dark={true} */}
        <InputV2
          dark
          onChange={onChange}
          name="demo"
          value="ok value"
        />
        <Icon name="ok_icon" />
        <InputV2
          dark
          onChange={onChange}
          name="demo"
          value="validating..."
        />
        <SpinnerV2 />
        <InputV2
          dark
          onChange={onChange}
          name="demo"
          value="0alkawja;jk"
          className="error"
        />
        <Icon name="alert_icon" />
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
