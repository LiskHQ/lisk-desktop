/* istanbul ignore file */
import React from 'react';
import { toast } from 'react-toastify';
import UpdateIndicator from '@toolbox/updateIndicator';

export default {
  init: () => {
    const { ipc } = window;
    const toastId = 'update-download';

    if (ipc) {
      ipc.on('downloadUpdateStart', () => {
        toast.info(<UpdateIndicator />, {
          toastId,
          autoClose: false,
          closeOnClick: false,
        });
      });

      ipc.on('downloadUpdateProgress', (action, { transferred, total }) => {
        toast.update(toastId, {
          render: () => <UpdateIndicator transferred={transferred} total={total} />,
        });
      });

      ipc.on('downloadUpdateCompleted', () => {
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
      });
    }
  },
};
