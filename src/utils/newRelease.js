import React from 'react';
import FlashMessageHolder from '../components/toolbox/flashMessage/holder';
import NewReleaseMessage from '../components/newReleaseMessage/newReleaseMessage';
import regex from './regex';

export default {
  init: () => {
    const { ipc } = window;
    if (!ipc) return;

    ipc.on('update:available', (action, { version, releaseNotes }) => {
      const releaseSummary = releaseNotes.match(regex.htmlElements)[2];
      FlashMessageHolder.addMessage(
        <NewReleaseMessage
          version={version}
          releaseNotes={releaseNotes}
          releaseSummary={releaseSummary}
          onClick={() => ipc.send('update:clicked')}
        />,
        'NewRelease',
      );
    });
  },
};
