import React from 'react';
import { storiesOf } from '@storybook/react';
import DropdownButton from 'src/theme/DropdownButton';
import StoryWrapper from '../../../.storybook/components/StoryWrapper/StoryWrapper';
import Dropdown from './dropdown';

storiesOf('Toolbox', module)
  .add('Dropdown', () => (
    <StoryWrapper>
      <h3>Dropdown Button</h3>
      <DropdownButton buttonLabel="Button that toggles it">
        <span>DropdownButton content 1</span>
        <span>DropdownButton content 2</span>
      </DropdownButton>
      <h3>Dropdown</h3>
      <span style={{ position: 'relative' }}>
        <span>Dropdown holder</span>
        <Dropdown showDropdown>
          <span align="center">Dropdown content 1</span>
          <span align="center">Dropdown content 2</span>
        </Dropdown>
      </span>
    </StoryWrapper>
  ));
