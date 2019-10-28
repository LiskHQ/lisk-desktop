import React from 'react';
import { PrimaryButton, TertiaryButton } from '../buttons/button';
import Box from '.';
import BoxHeader from './header';
import BoxContent from './content';
import BoxRow from './row';
import BoxFooter from './footer';
import BoxFooterButton from './footerButton';
import BoxEmptyState from './emptyState';
import BoxTabs from '../tabs';
import DemoRenderer from '../demoRenderer';
import Icon from '../icon';

/* eslint-disable-next-line no-console */
const onClick = console.log;

const BoxDemo = () => (
  <React.Fragment>
    <h2>Box</h2>
    <DemoRenderer>
      <Box main isLoading>
        <BoxContent> Content </BoxContent>
      </Box>
    </DemoRenderer>
    <DemoRenderer>
      <Box width="medium">
        <BoxHeader>
          <h1>Custom header</h1>
        </BoxHeader>
        <BoxContent>Content</BoxContent>
        <BoxFooter>
          <PrimaryButton onClick={onClick}>Submit</PrimaryButton>
          <TertiaryButton onClick={onClick}>Cancel</TertiaryButton>
        </BoxFooter>
      </Box>
    </DemoRenderer>
    <DemoRenderer>
      <Box isLoading>
        <BoxHeader>
          <BoxTabs
            tabs={[
              { name: 'Tab 1', value: 'tab1' },
              { name: 'Tab 2', value: 'tab2' },
            ]}
            onClick={onClick}
            active="tab2"
          />
          <span>Some other stuff</span>
        </BoxHeader>
        <BoxContent>
          <BoxRow>Row #1</BoxRow>
          <BoxRow>Row #2</BoxRow>
          <BoxRow>Row #3</BoxRow>
          <BoxRow>Row #4</BoxRow>
        </BoxContent>
        <BoxFooterButton onClick={onClick}>Load more</BoxFooterButton>
      </Box>
    </DemoRenderer>
    <DemoRenderer>
      <Box>
        <BoxHeader>
          <h1>Custom header</h1>
        </BoxHeader>
        <BoxEmptyState>
          <Icon name="noTweetsIcon" />
          <h1>Title of empty state</h1>
          <p>And some longer text explaining what to do about this situation</p>
        </BoxEmptyState>
      </Box>
    </DemoRenderer>
  </React.Fragment>
);

export default BoxDemo;
