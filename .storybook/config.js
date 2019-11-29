import { configure } from '@storybook/react';
import '../src/app/app.css';
import '../src/app/variables.css';

// automatically import all files ending in *.stories.js
const req = require.context('../src/components', true, /.stories.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
