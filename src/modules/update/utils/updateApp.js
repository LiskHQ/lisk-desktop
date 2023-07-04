/* istanbul ignore file */
import React from 'react';
import { toast } from 'react-toastify';
import {
  IPC_DOWNLOAD_UPDATE_COMPLETED,
  IPC_DOWNLOAD_UPDATE_PROGRESS,
  IPC_DOWNLOAD_UPDATE_START,
  IPC_UPDATE_QUIT_AND_INSTALL,
} from 'src/const/ipcGlobal';
import UpdateIndicator from '../detail/info/updateIndicator';

export default {
  init: () => {
    const { ipc } = window;
    const toastId = 'update-download';
    let state = 'not-started';

    if (ipc) {
      ipc[IPC_DOWNLOAD_UPDATE_START](() => {
        if (state === 'not-started') {
          state = 'started';
          toast.info(<UpdateIndicator />, {
            toastId,
            autoClose: false,
            closeOnClick: false,
          });
        }
      });

      ipc[IPC_DOWNLOAD_UPDATE_PROGRESS]((action, { transferred, total }) => {
        toast.update(toastId, {
          render: () => <UpdateIndicator transferred={transferred} total={total} />,
        });
      });

      ipc[IPC_DOWNLOAD_UPDATE_COMPLETED](() => {
        if (state === 'not-started') {
          state = 'completed';
          toast.info(
            <UpdateIndicator
              quitAndInstall={() => {
                ipc[IPC_UPDATE_QUIT_AND_INSTALL]();
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
                  ipc[IPC_UPDATE_QUIT_AND_INSTALL]();
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
