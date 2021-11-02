import React from 'react';
import { toast } from 'react-toastify';
import UpdateIndicator from '@toolbox/updateIndicator';

export default {
  init: () => {
    const { ipc } = window;
    const toastId = 'update-download';

    if (ipc) {
      ipc.on('updateStart', () => {
        toast(<UpdateIndicator />, {
          toastId,
          autoClose: false,
          closeOnClick: false,
        });
      });

      ipc.on('downloadProgress', (action, { transferred, total }) => {
        toast.update(toastId, {
          render: () => <UpdateIndicator transferred={transferred} total={total} />,
        });
      });

      ipc.on('updateDownloaded', () => {
        toast.update(toastId, {
          render: () => (
            <UpdateIndicator
              quitAndInstall={() => {
                ipc.send('update:quitAndInstall');
              }}
              completed
            />
          ),
        });
      });
    }
  },
};
