import React from 'react';

import { storiesOf } from '@storybook/react';

import FormattedNumber from './';

storiesOf('FormattedNumber', module)
  .add('with val', () => (
    <FormattedNumber val="-3.1415926535" />
  ));
