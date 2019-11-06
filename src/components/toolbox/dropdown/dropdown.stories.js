import React from 'react';
import { storiesOf } from '@storybook/react';
import StoryWrapper from '../../../../.storybook/components/StoryWrapper/StoryWrapper';
import Dropdown from './dropdown';


storiesOf('Toolbox', module)
  .add('Dropdown', () => (
    <StoryWrapper>
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
