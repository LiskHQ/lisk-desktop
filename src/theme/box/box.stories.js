import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Icon from 'src/theme/Icon';
import StoryWrapper from '../../../.storybook/components/StoryWrapper/StoryWrapper';
import Box from './index';
import BoxContent from './content';
import BoxHeader from './header';
import BoxFooter from './footer';
import { PrimaryButton, TertiaryButton } from '../buttons';
import BoxTabs from '../tabs';
import BoxRow from './row';
import BoxFooterButton from './footerButton';
import BoxEmptyState from './emptyState';

storiesOf('Toolbox', module)
  .add('Box', () => (
    <StoryWrapper>
      <h3>Box main isLoading </h3>
      <Box main isLoading>
        <BoxContent> Content </BoxContent>
      </Box>
      <h3>Box width=medium header footer</h3>
      <Box width="medium">
        <BoxHeader>
          <h1>Custom header</h1>
        </BoxHeader>
        <BoxContent>Content</BoxContent>
        <BoxFooter>
          <PrimaryButton>Submit</PrimaryButton>
          <TertiaryButton>Cancel</TertiaryButton>
        </BoxFooter>
      </Box>
      <h3>Box isLoading header tabs content row footerButton</h3>
      <Box isLoading>
        <BoxHeader>
          <BoxTabs
            tabs={[
              { name: 'Tab 1', value: 'tab1' },
              { name: 'Tab 2', value: 'tab2' },
            ]}
            onClick={action('clicked')}
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
        <BoxFooterButton onClick={action('clicked')}>Load more</BoxFooterButton>
      </Box>
      <h3>Box header emptyState icon</h3>
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
    </StoryWrapper>
  ));
