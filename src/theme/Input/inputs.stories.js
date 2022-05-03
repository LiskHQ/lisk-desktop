import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import StoryWrapper from '../../../.storybook/components/StoryWrapper/StoryWrapper';
import Input from './Input';

const DarkWrapper = ({ children, display }) => (
  <span style={{
    display, background: '#0c152e', padding: 20, margin: 40,
  }}
  >
    {children}
  </span>
);

storiesOf('Toolbox', module)
  .add('Inputs', () => (
    <StoryWrapper>
      <h3>Input sizes</h3>
      <Input
        type="text"
        size="l"
        label="Label"
        onChange={action('changed')}
        placeholder="size l"
      />
      <Input
        type="text"
        size="m"
        label="Label"
        onChange={action('changed')}
        placeholder="size m"
      />
      <Input
        type="text"
        size="s"
        label="Label"
        onChange={action('changed')}
        placeholder="size s"
      />
      <Input
        type="text"
        size="xs"
        label="Label"
        onChange={action('changed')}
        placeholder="size xs"
      />
      <h3>States</h3>
      <Input
        type="text"
        status="ok"
        value="ok value"
        label="Label"
        onChange={action('changed')}
        placeholder="e.g. 192.168.0.1"
      />
      <Input
        type="text"
        status="pending"
        value="validating..."
        label="Label"
        onChange={action('changed')}
        placeholder="e.g. 192.168.0.1"
      />
      <Input
        type="text"
        status="error"
        value="0alkawja;jk"
        label="Label"
        onChange={action('changed')}
        placeholder="e.g. 192.168.0.1"
      />
      <DarkWrapper display="block">
        <Input
          type="text"
          status="ok"
          value="ok value"
          label="Label"
          onChange={action('changed')}
          placeholder="e.g. 192.168.0.1"
          dark
        />
        <Input
          type="text"
          status="pending"
          value="validating..."
          label="Label"
          onChange={action('changed')}
          placeholder="e.g. 192.168.0.1"
          dark
        />
        <Input
          type="text"
          status="error"
          value="0alkawja;jk"
          label="Label"
          onChange={action('changed')}
          placeholder="e.g. 192.168.0.1"
          dark
        />
      </DarkWrapper>
      <h3>Input with Icon</h3>
      <Input
        type="text"
        size="m"
        label="Search"
        onChange={action('changed')}
        icon="searchInput"
        placeholder="Type something to search..."
      />
    </StoryWrapper>
  ));
