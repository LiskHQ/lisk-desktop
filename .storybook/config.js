import { configure } from '@storybook/react';
import '../src/components/app/app.css';

function loadStories() {
  require('../src/components/account/stories');
  require('../src/components/dialog/stories');
  require('../src/components/formattedNumber/stories');
}

configure(loadStories, module);
