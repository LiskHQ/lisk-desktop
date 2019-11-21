import React from 'react';
import { storiesOf } from '@storybook/react';
import { PrimaryButton, SecondaryButton } from '../buttons/button';
import StoryWrapper from '../../../../.storybook/components/StoryWrapper/StoryWrapper';
import Dialog from './dialog';
import DialogHolder from './holder';

storiesOf('Toolbox', module)
  .add('Dialog', () => (
    <StoryWrapper>
      <h3>Dialog</h3>
      <DialogHolder>
        <Dialog hasClose>
          <Dialog.Title>
            Dialog Title
          </Dialog.Title>
          <Dialog.Description>
            Description
          </Dialog.Description>
          <Dialog.Options align="center">
            <SecondaryButton>
              Cancel
            </SecondaryButton>
            <PrimaryButton>
              Accept
            </PrimaryButton>
          </Dialog.Options>
        </Dialog>
      </DialogHolder>
    </StoryWrapper>
  ));
