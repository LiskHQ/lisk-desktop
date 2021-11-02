import React from 'react';
import { toast } from 'react-toastify';
import UpdateIndicator from '@toolbox/updateIndicator';

export default {
  init: () => {
    const { ipc } = window;
    const toastId = 'update-download';

    toast(<UpdateIndicator />, {
      toastId,
      autoClose: false,
    });

    if (ipc) {
      ipc.on('downloadProgress', (action, { transferred, total }) => {
        toast.update(toastId, {
          render: () => <UpdateIndicator transferred={transferred} total={total} />,
        });
      });
      ipc.on('updateDownloaded', (action, onAction) => {
        toast.update(toastId, {
          render: () => <UpdateIndicator onAction={onAction} completed />,
        });
      });
    }
  },
};
