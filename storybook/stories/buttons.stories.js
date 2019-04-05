import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import StoryWrapper from '../components/StoryWrapper/StoryWrapper';
import { PrimaryButtonV2, SecondaryButtonV2, TertiaryButtonV2 } from 'Components/toolbox/buttons/button';
import svg from 'Utils/svgIcons';

storiesOf('Button', module)
  .add('Primary Button', () => (
    <StoryWrapper>
      <h2 className={'story-title'}>Enabled State</h2>
      <div className={'story-components-holder'}>
        <div>
          <h3 className={'story-label'}>large</h3>
          <PrimaryButtonV2 onClick={action('clicked')}>Get from GitHub</PrimaryButtonV2>
        </div>
        {
          ['medium', 'small', 'extra-small'].map(size =>
            <div key={`button-${size}`}>
              <h3 className={'story-label'}>{size}</h3>
              <PrimaryButtonV2
                className={size}
                onClick={action('clicked')}
              >
                Get from GitHub
              </PrimaryButtonV2>
            </div>
          )
        }
      </div>
      <h2 className={'story-title'}>Disabled State</h2>
      <div className={'story-components-holder'}>
        <div>
          <h3 className={'story-label'}>large</h3>
          <PrimaryButtonV2 disabled>Get from GitHub</PrimaryButtonV2>
        </div>
        {
          ['medium', 'small', 'extra-small'].map(size =>
            <div key={`button-${size}`}>
              <h3 className={'story-label'}>{size}</h3>
              <PrimaryButtonV2 disabled
                className={size}
              >
                Get from GitHub
              </PrimaryButtonV2>
            </div>
          )
        }
      </div>
    </StoryWrapper>
  ))
  .add('Secondary Button', () => (
    <React.Fragment>
      <StoryWrapper>
        <h2 className={'story-title'}>Enabled State</h2>
        <div className={'story-components-holder'}>
          <div>
            <h3 className={'story-label'}>large</h3>
            <SecondaryButtonV2 onClick={action('clicked')}>Get from GitHub</SecondaryButtonV2>
          </div>
          {
            ['medium', 'small', 'extra-small'].map(size =>
              <div key={`button-${size}`}>
                <h3 className={'story-label'}>{size}</h3>
                <SecondaryButtonV2
                  className={size}
                  onClick={action('clicked')}
                >
                  Get from GitHub
                </SecondaryButtonV2>
              </div>
            )
          }
        </div>
        <h2 className={'story-title'}>With Icon</h2>
        <div className={'story-components-holder'}>
          <div>
            <h3 className={'story-label'}>large</h3>
            <SecondaryButtonV2 onClick={action('clicked')}>
              Get from GitHub
              <img className={'button-icon'} src={svg.iconFilter} />
            </SecondaryButtonV2>
          </div>
          {
            ['medium', 'small', 'extra-small'].map(size =>
              <div key={`button-${size}`}>
                <h3 className={'story-label'}>{size}</h3>
                <SecondaryButtonV2
                  className={size}
                  onClick={action('clicked')}
                >
                  Get from GitHub
                  <img className={'button-icon'} src={svg.iconFilter} />
                </SecondaryButtonV2>
              </div>
            )
          }
        </div>
        <h2 className={'story-title'}>Disabled State</h2>
        <div className={'story-components-holder'}>
          <div>
            <h3 className={'story-label'}>large</h3>
            <SecondaryButtonV2 disabled>Get from GitHub</SecondaryButtonV2>
          </div>
          {
            ['medium', 'small', 'extra-small'].map(size =>
              <div key={`button-${size}`}>
                <h3 className={'story-label'}>{size}</h3>
                <SecondaryButtonV2 disabled
                  className={size}
                >
                  Get from GitHub
                </SecondaryButtonV2>
              </div>
            )
          }
        </div>
      </StoryWrapper>
      <StoryWrapper className={'dark'}>
        <div className={'story-components-holder'}>
          <div>
            <h3 className={'story-label'}>large</h3>
            <SecondaryButtonV2 className={'light'} onClick={action('clicked')}>Get from GitHub</SecondaryButtonV2>
          </div>
          {
            ['medium', 'small', 'extra-small'].map(size =>
              <div key={`button-${size}`}>
                <h3 className={'story-label'}>{size}</h3>
                <SecondaryButtonV2
                  className={`${size} light`}
                  onClick={action('clicked')}
                >
                  Get from GitHub
                </SecondaryButtonV2>
              </div>
            )
          }
        </div>
        <h2 className={'story-title'}>Disabled State</h2>
        <div className={'story-components-holder'}>
          <div>
            <h3 className={'story-label'}>large</h3>
            <SecondaryButtonV2 disabled
              className={'light'}
            >
              Get from GitHub
            </SecondaryButtonV2>
          </div>
          {
            ['medium', 'small', 'extra-small'].map(size =>
              <div key={`button-${size}`}>
                <h3 className={'story-label'}>{size}</h3>
                <SecondaryButtonV2
                  disabled
                  className={`${size} light`}
                >
                  Get from GitHub
                </SecondaryButtonV2>
              </div>
            )
          }
        </div>
      </StoryWrapper>
    </React.Fragment>
  ))
  .add('Tertiary Button', () => (
    <StoryWrapper>
      <h2 className={'story-title'}>Enabled State</h2>
      <div className={'story-components-holder'}>
        <div>
          <h3 className={'story-label'}>large</h3>
          <TertiaryButtonV2 onClick={action('clicked')}>Get from GitHub</TertiaryButtonV2>
        </div>
        {
          ['medium', 'small', 'extra-small'].map(size =>
            <div key={`button-${size}`}>
              <h3 className={'story-label'}>{size}</h3>
              <TertiaryButtonV2
                className={size}
                onClick={action('clicked')}
              >
                Get from GitHub
              </TertiaryButtonV2>
            </div>
          )
        }
      </div>
      <h2 className={'story-title'}>Disabled State</h2>
      <div className={'story-components-holder'}>
        <div>
          <h3 className={'story-label'}>large</h3>
          <TertiaryButtonV2 disabled>Get from GitHub</TertiaryButtonV2>
        </div>
        {
          ['medium', 'small', 'extra-small'].map(size =>
            <div key={`button-${size}`}>
              <h3 className={'story-label'}>{size}</h3>
              <TertiaryButtonV2 disabled
                className={size}
              >
                Get from GitHub
              </TertiaryButtonV2>
            </div>
          )
        }
      </div>
    </StoryWrapper>
  ));
