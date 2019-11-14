import React from 'react';
import { storiesOf } from '@storybook/react';
import StoryWrapper from '../../../../.storybook/components/StoryWrapper/StoryWrapper';
import Dialog from './dialog';

storiesOf('Toolbox', module)
  .add('Dialog', () => (
    <StoryWrapper>
      <h3>Dialog</h3>
      <Dialog hasClose>
        <Dialog.Title>Dummy Title</Dialog.Title>
        <Dialog.Description>dsa</Dialog.Description>
        <Dialog.Options align="center">sdvs</Dialog.Options>
      </Dialog>
    </StoryWrapper>
  ));
