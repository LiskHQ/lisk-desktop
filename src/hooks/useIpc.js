import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';

import htmlStringToReact from '@utils/htmlStringToReact';
import { regex } from '@constants';
import { addSearchParamsToUrl, removeSearchParamsFromUrl } from '@utils/searchParams';
import { appUpdateAvailable } from '@actions';
import FlashMessageHolder from '@toolbox/flashMessage/holder';
import NewReleaseMessage from '@shared/newReleaseMessage/newReleaseMessage';

const useIpc = (history) => {
  const dispatch = useDispatch();

  const { ipc } = window;

  //if (!ipc) return;

  useEffect(() => {
    // ipc.on('update:available', (action, { version, releaseNotes }) => {
      const readMore = () => {
        addSearchParamsToUrl(history, { modal: 'newRelease' });
      };

      const remindMeLater = () => {
        FlashMessageHolder.deleteMessage('NewRelease');
        removeSearchParamsFromUrl(history, ['modal']);
      };

      const updateNow = () => {
        ipc.send('update:started');
        setTimeout(() => {
          FlashMessageHolder.deleteMessage('NewRelease');
        }, 500);
      };

      const version = '2.2.0';
      const releaseNotes = '<h4>asfsabjhskdnsadksadnkasdnsajdsakjdaj</h4><p>injklmklmlk 2132143454354</p>';
      const [releaseSummary] = releaseNotes.match(regex.releaseSummary)?.slice(1);
      dispatch(appUpdateAvailable({
        version, releaseNotes, remindMeLater, updateNow,
      }));

      FlashMessageHolder.addMessage(
        <NewReleaseMessage
          version={version}
          releaseNotes={releaseNotes}
          releaseSummary={htmlStringToReact(releaseSummary)}
          readMore={readMore}
          updateNow={updateNow}
        />,
        'NewRelease',
      );
    // });
  }, []);
};

export default useIpc;
