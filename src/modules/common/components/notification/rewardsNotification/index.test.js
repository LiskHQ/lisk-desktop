import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { ToastContainer } from 'react-toastify';
import { ApplicationBootstrapContext } from '@setup/react/app/ApplicationBootstrap';
import { smartRender } from 'src/utils/testHelpers';
import RewardsNotification from '.';

describe('RewardsNotification', () => {
  it('renders properly', async () => {
    const Component = (props) => (
      <ApplicationBootstrapContext.Provider
        value={{ appEvents: { transactions: { rewards: [{ reward: 10000 }] } } }}
      >
        <ToastContainer />
        <RewardsNotification {...props} />
      </ApplicationBootstrapContext.Provider>
    );
    smartRender(Component);

    await waitFor(() => {
      expect(screen.getByText('You have an unclaimed reward of your stakes.')).toBeVisible();
    });
  });

  it('does not render if there are no rewards', async () => {
    const Component = (props) => (
      <ApplicationBootstrapContext.Provider
        value={{ appEvents: { transactions: { rewards: [] } } }}
      >
        <ToastContainer />
        <RewardsNotification {...props} />
      </ApplicationBootstrapContext.Provider>
    );
    smartRender(Component);

    await waitFor(() => {
      expect(
        screen.queryByText('You have an unclaimed reward of your stakes.')
      ).not.toBeInTheDocument();
    });
  });
});
