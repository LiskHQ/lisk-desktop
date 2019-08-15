import React from 'react';
import DemoRenderer, { DarkWrapper } from '../demoRenderer';
import { Input, AutoresizeTextarea } from '.';
import Feedback from '../feedback/feedback';
import Icon from '../icon';
import Spinner from '../../spinner/spinner';

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
      />
      {/* TODO fix Input to accept props.status='ok' so that next line is not needed */}
      <Icon name="okIcon" />
      <Input
        onChange={onChange}
        name="demo"
        value="validating..."
      />
      {/* TODO fix Input to accept props.status='pending' so that next line is not needed */}
      <Spinner />
      <Input
        onChange={onChange}
        name="demo"
        value="0alkawja;jk"
        className="error"
      />
      {/* TODO fix Input to accept props.status='error' so that next line is not needed */}
      <Icon name="alertIcon" />
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
        />
        <Icon name="okIcon" />
        <Input
          onChange={onChange}
          name="demo"
          value="validating..."
        />
        <Spinner />
        <Input
          onChange={onChange}
          name="demo"
          value="0alkawja;jk"
          className="error"
        />
        <Icon name="alertIcon" />
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
