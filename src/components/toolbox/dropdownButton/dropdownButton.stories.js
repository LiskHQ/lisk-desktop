import React from 'react';
import { storiesOf } from '@storybook/react';
import StoryWrapper from '../../../../.storybook/components/StoryWrapper/StoryWrapper';
import DropdownButton from './index';

storiesOf('Toolbox', module)
  .add('DropdownButton', () => (
    <StoryWrapper>
      <h3>DropdownButton</h3>
      <DropdownButton buttonLabel="Button that toggles it">
        <span>DropdownButton content 1</span>
        <span>DropdownButton content 2</span>
      </DropdownButton>
    </StoryWrapper>
  ));
