import React from 'react';
import { PrimaryButton, TertiaryButton } from '../buttons/button';
import Box from '.';
import DemoRenderer from '../demoRenderer';
import Icon from '../icon';

/* eslint-disable-next-line no-console */
const onClick = console.log;

const BoxDemo = () => (
  <React.Fragment>
    <h2>Box</h2>
    <DemoRenderer>
      <Box main isLoading>
        <Box.Content> Content </Box.Content>
      </Box>
    </DemoRenderer>
    <DemoRenderer>
      <Box width="medium">
        <Box.Header>
          <h1>Custom header</h1>
        </Box.Header>
        <Box.Content>Content</Box.Content>
        <Box.Footer>
          <PrimaryButton onClick={onClick}>Submit</PrimaryButton>
          <TertiaryButton onClick={onClick}>Cancel</TertiaryButton>
        </Box.Footer>
      </Box>
    </DemoRenderer>
    <DemoRenderer>
      <Box isLoading>
        <Box.Header>
          <Box.Tabs
            tabs={[
              { name: 'Tab 1', value: 'tab1' },
              { name: 'Tab 2', value: 'tab2' },
            ]}
            onClick={onClick}
            active="tab2"
          />
          <span>Some other stuff</span>
        </Box.Header>
        <Box.Content>
          <Box.Row>Row #1</Box.Row>
          <Box.Row>Row #2</Box.Row>
          <Box.Row>Row #3</Box.Row>
          <Box.Row>Row #4</Box.Row>
        </Box.Content>
        <Box.FooterButton onClick={onClick}>Load more</Box.FooterButton>
      </Box>
    </DemoRenderer>
    <DemoRenderer>
      <Box>
        <Box.Header>
          <h1>Custom header</h1>
        </Box.Header>
        <Box.EmptyState>
          <Icon name="noTweetsIcon" />
          <h1>Title of empty state</h1>
          <p>And some longer text explaining what to do about this situation</p>
        </Box.EmptyState>
      </Box>
    </DemoRenderer>
  </React.Fragment>
);

export default BoxDemo;
