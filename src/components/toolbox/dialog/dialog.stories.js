import React, { useEffect } from 'react';
import { storiesOf } from '@storybook/react';
import { PrimaryButton } from '../buttons/button';
import StoryWrapper from '../../../../.storybook/components/StoryWrapper/StoryWrapper';
import Dialog from './dialog';
import DialogHolder from './holder';

storiesOf('Toolbox', module)
  .add('Dialog', () => {
    const showDialog = () => {
      DialogHolder.showDialog(
        <Dialog hasClose>
          <Dialog.Title>Dummy Title</Dialog.Title>
          <Dialog.Description>dsa</Dialog.Description>
          <Dialog.Options align="center">sdvs</Dialog.Options>
        </Dialog>,
      );
    };
    useEffect(showDialog, []);
    return (
      <StoryWrapper>
        <h3>Dialog</h3>
        <DialogHolder />
        <PrimaryButton onClick={showDialog}>Show dialog</PrimaryButton>
      </StoryWrapper>
    );
  });
