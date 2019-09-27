import React from 'react';
import htmlStringToReact from './htmlStringToReact';
import regex from './regex';
import FlashMessageHolder from '../components/toolbox/flashMessage/holder';
import NewReleaseMessage from '../components/shared/newReleaseMessage/newReleaseMessage';
import DialogHolder from '../components/toolbox/dialog/holder';
import NewReleaseDialog from '../components/shared/newReleaseDialog/newReleaseDialog';
import store from '../store';
import { toastDisplayed } from '../actions/toaster';

export default {
  init: () => {
    const { ipc } = window;
    if (!ipc) return;

    ipc.on('update:available', (action, { version, releaseNotes }) => {
      const [releaseSummary] = releaseNotes.match(regex.releaseSummary).slice(1);

      const onClick = () => {
        DialogHolder.showDialog(
          <NewReleaseDialog
            version={version}
            releaseNotes={htmlStringToReact(releaseNotes)}
            ipc={ipc}
          />,
        );
      };

      FlashMessageHolder.addMessage(
        <NewReleaseMessage
          version={version}
          releaseNotes={releaseNotes}
          releaseSummary={htmlStringToReact(releaseSummary)}
          onClick={onClick}
        />,
        'NewRelease',
      );
    });

    ipc.on('update:downloading', (action, { label }) => {
      store.dispatch(toastDisplayed({ label }));
    });
  },
};
