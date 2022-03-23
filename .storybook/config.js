import { configure } from '@storybook/react';
import '../react/app/app.css';
import '../react/app/variables.css';

// automatically import all files ending in *.stories.js
const req = require.context('../../../../packages', true, /.stories.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
