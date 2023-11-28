import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { ToastContainer } from 'react-toastify';
import { ApplicationBootstrapContext } from '@setup/react/app/ApplicationBootstrap';
import { smartRender } from 'src/utils/testHelpers';
import IndexingNotification from '.';

describe('IndexingNotification', () => {
  it('renders properly', async () => {
    const Component = () => (
      <ApplicationBootstrapContext.Provider
        value={{
          indexStatus: {
            percentageIndexed: 98.69,
            isIndexingInProgress: true,
            chainLength: 263945,
            numBlocksIndexed: 263938,
          },
        }}
      >
        <ToastContainer />
        <IndexingNotification />
      </ApplicationBootstrapContext.Provider>
    );
    smartRender(Component);

    await waitFor(
      () => {
        expect(screen.getByText('Blockchain client syncing: true')).toBeVisible();
        expect(screen.getByText('Service indexing progress: 98.69%')).toBeVisible();
      },
      { timeout: 3000 }
    );
  });

  it('does not render if indexing is not in progress', async () => {
    const Component = () => (
      <ApplicationBootstrapContext.Provider
        value={{
          indexStatus: {
            percentageIndexed: 100,
            isIndexingInProgress: false,
            chainLength: 263945,
            numBlocksIndexed: 263945,
          },
        }}
      >
        <ToastContainer />
        <IndexingNotification />
      </ApplicationBootstrapContext.Provider>
    );
    smartRender(Component);

    await waitFor(() => {
      expect(screen.queryByText('Blockchain client syncing: false')).not.toBeInTheDocument();
      expect(screen.queryByText('Service indexing progress: 100%')).not.toBeInTheDocument();
    });
  });
});
