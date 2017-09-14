import { configure } from '@storybook/react';
import '../src/components/app/app.css';

function loadStories() {
  require('../src/components/account/stories');
  require('../src/components/dialog/stories');
  require('../src/components/formattedNumber/stories');
  require('../src/components/toaster/stories');
  require('../src/components/signMessage/stories');
  require('../src/components/send/stories');
  require('../src/components/spinner/stories');
  require('../src/components/verifyMessage/stories');
}

configure(loadStories, module);
