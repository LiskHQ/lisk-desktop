import { configure } from '@storybook/react';
import '../src/components/app/app.css';

function loadStories() {
  require('../stories');
}

configure(loadStories, module);
