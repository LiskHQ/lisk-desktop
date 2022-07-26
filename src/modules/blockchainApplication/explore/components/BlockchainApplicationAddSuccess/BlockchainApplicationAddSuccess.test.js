import { fireEvent, screen } from '@testing-library/react';
import { renderWithRouter } from 'src/utils/testHelpers';
import BlockchainApplicationAddSuccess from './BlockchainApplicationAddSuccess';

const props = {
  history: {
    push: jest.fn(),
  },
};

describe('BlockchainApplicationAddSuccess', () => {
  it('displays properly', () => {
    renderWithRouter(BlockchainApplicationAddSuccess, props);

    expect(screen.getByText('Perfect! Application has now been added')).toBeTruthy();
    expect(screen.getByText('You can see a list of your applications on the dashboard.')).toBeTruthy();
  });

  it('should reroute to the dashboard on success', () => {
    renderWithRouter(BlockchainApplicationAddSuccess, props);
    fireEvent.click(screen.getByRole('button'));

    expect(props.history.push).toHaveBeenCalledTimes(1);
    expect(props.history.push).toHaveBeenCalledWith('/dashboard');
  });
});
