import React from 'react';

import { storiesOf } from '@storybook/react';
import StoryWrapper from '../components/StoryWrapper/StoryWrapper';
import InputWrapper from '../components/InputWrapper/InputWrapper';
import { InputV2, TextareaV2, AutoresizeTextarea } from 'Components/toolbox/inputsV2';

storiesOf('Inputs', module)
  .add('Inputs', () => (
    <StoryWrapper>
      <div className={'story-components-holder story-vertical'}>
        <div>
          <h3 className={'story-label'}>Enabled state</h3>
          <InputWrapper><InputV2 placeholder={'Placeholder text'} /></InputWrapper>
        </div>
        <div>
          <h3 className={'story-label'}>Readonly</h3>
          <InputWrapper><InputV2 readOnly value={'Read only value'} /></InputWrapper>
        </div>
        <div>
          <h3 className={'story-label'}>With Error</h3>
          <InputWrapper><InputV2 className={'error'} value={'Some content with error'} /></InputWrapper>
        </div>
      </div>
    </StoryWrapper>
  ))
  .add('TextArea', () => (
    <StoryWrapper>
      <div className={'story-components-holder story-vertical'}>
        <div>
          <h3 className={'story-label'}>Enabled state</h3>
          <InputWrapper><TextareaV2 placeholder={'Placeholder text'} /></InputWrapper>
        </div>
        <div>
          <h3 className={'story-label'}>Readonly</h3>
          <InputWrapper><TextareaV2 readOnly value={'Read only value'} /></InputWrapper>
        </div>
        <div>
          <h3 className={'story-label'}>With Error</h3>
          <InputWrapper><TextareaV2 className={'error'} value={'Some content with error'} /></InputWrapper>
        </div>
        <div>
          <h3 className={'story-label'}>Auto Resize</h3>
          <InputWrapper><AutoresizeTextarea /></InputWrapper>
        </div>
      </div>
    </StoryWrapper>
  ));
