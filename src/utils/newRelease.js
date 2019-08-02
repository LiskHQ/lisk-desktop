import React from 'react';
import FlashMessageHolder from '../components/toolbox/flashMessage/holder';
import NewReleaseMessage from '../components/newReleaseMessage/newReleaseMessage';

export default {
  init: () => {
    const { ipc } = window;
    if (!ipc) return;

    ipc.on('update:available', (action, { version, releaseNotes }) => {
      /* istanbul ignore next */
      const onClick = () => ipc.send('update:clicked');
      FlashMessageHolder.addMessage(
        <NewReleaseMessage
          version={version}
          releaseNotes={releaseNotes}
          onClick={onClick}
        />,
        'NewRelease',
      );
    });
  },
};
