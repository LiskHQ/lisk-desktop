/* istanbul ignore file */
import React from 'react';
import { toast } from 'react-toastify';
import UpdateIndicator from '../detail/info/updateIndicator';

export default {
  init: () => {
    const { ipc } = window;
    const toastId = 'update-download';
    let state = 'not-started';

    if (ipc) {
      ipc.on('downloadUpdateStart', () => {
        if (state === 'not-started') {
          state = 'started';
          toast.info(<UpdateIndicator />, {
            toastId,
            autoClose: false,
            closeOnClick: false,
          });
        }
      });

      ipc.on('downloadUpdateProgress', (action, { transferred, total }) => {
        toast.update(toastId, {
          render: () => <UpdateIndicator transferred={transferred} total={total} />,
        });
      });

      ipc.on('downloadUpdateCompleted', () => {
        if (state === 'not-started') {
          state = 'completed';
          toast.info(
            <UpdateIndicator
              quitAndInstall={() => {
                ipc.send('updateQuitAndInstall');
              }}
              completed
            />,
            {
              toastId,
              autoClose: false,
              closeOnClick: false,
            }
          );
        } else {
          state = 'completed';
          toast.update(toastId, {
            render: () => (
              <UpdateIndicator
                quitAndInstall={() => {
                  ipc.send('updateQuitAndInstall');
                }}
                completed
              />
            ),
          });
        }
      });
    }
  },
};
