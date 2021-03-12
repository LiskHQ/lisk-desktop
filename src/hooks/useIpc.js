import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import htmlStringToReact from 'utils/htmlStringToReact';
import regex from 'utils/regex';
import { addSearchParamsToUrl } from 'utils/searchParams';
import { appUpdateAvaiable } from 'actions/appUpdates';
import FlashMessageHolder from 'toolbox/flashMessage/holder';
import NewReleaseMessage from 'shared/newReleaseMessage/newReleaseMessage';


const useIpc = (history) => {
  const dispatch = useDispatch();

  const { ipc } = window;

  if (!ipc) return;

  useEffect(() => {
    ipc.on('update:available', (action, { version, releaseNotes }) => {
      const [releaseSummary] = releaseNotes.match(regex.releaseSummary).slice(1);
      dispatch(appUpdateAvaiable({
        version, ipc, releaseNotes,
      }));

      const readMore = () => {
        addSearchParamsToUrl(history, { modal: 'newRelease' });
      };

      const updateNow = () => {
        ipc.send('update:started');
        setTimeout(() => {
          FlashMessageHolder.deleteMessage('NewRelease');
        }, 500);
      };

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
    });

    ipc.on('update:downloading', (action, { label }) => {
      toast.success(label);
    });
  }, []);
};

export default useIpc;
