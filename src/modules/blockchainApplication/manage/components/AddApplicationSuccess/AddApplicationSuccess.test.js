import { fireEvent, screen } from '@testing-library/react';
import { renderWithRouter } from 'src/utils/testHelpers';
import AddApplicationSuccess from './AddApplicationSuccess';

const props = {
  history: {
    push: jest.fn(),
    location: {
      search: '',
      pathname: '/'
    },
  },
};

describe('AddApplicationSuccess', () => {
  it('displays properly', () => {
    renderWithRouter(AddApplicationSuccess, props);

    expect(screen.getByText('Perfect! Application has now been added')).toBeTruthy();
    expect(
      screen.getByText('You can see a list of your applications on the network dropdown.')
    ).toBeTruthy();
  });

  it('should reroute to the wallet on success', () => {
    renderWithRouter(AddApplicationSuccess, props);
    fireEvent.click(screen.getByRole('button'));

    expect(props.history.push).toHaveBeenCalledTimes(1);
    expect(props.history.push).toHaveBeenCalledWith('/?modal=manageApplications');
  });
});
