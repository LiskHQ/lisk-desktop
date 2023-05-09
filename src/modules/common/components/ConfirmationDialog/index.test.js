import { screen, fireEvent } from '@testing-library/react';
import { renderWithCustomRouter } from 'src/utils/testHelpers';
import ConfirmationDialog from '.';

const mockOnCancel = jest.fn();
const mockOnConfirm = jest.fn();
const cancelBtnText = 'Cancel app switch';
const confirmBtnText = 'Continue to app switch';

describe('ConfirmationDialog', () => {
  const location = {
    pathname: 'modal=confirmationDialog',
    state: {
      header: 'Pending Stakes',
      content:
        'Switching your application and (or) network will remove all your pending stakes. Are you sure you want to continue?',
      cancelText: cancelBtnText,
      onCancel: mockOnCancel,
      confirmText: confirmBtnText,
      onConfirm: mockOnConfirm,
    },
  };
  const props = {
    location,
    history: {
      location,
    },
  };

  it('renders properly', () => {
    renderWithCustomRouter(ConfirmationDialog, props);
    expect(screen.getByText('Pending Stakes')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Switching your application and (or) network will remove all your pending stakes. Are you sure you want to continue?'
      )
    ).toBeInTheDocument();
    expect(screen.getByText(cancelBtnText)).toBeInTheDocument();
    expect(screen.getByText(confirmBtnText)).toBeInTheDocument();
    fireEvent.click(screen.getByText(confirmBtnText));
    expect(mockOnConfirm).toHaveBeenCalled();
  });

  it('renders fallback if not location state is passed', () => {
    renderWithCustomRouter(ConfirmationDialog, { history: {} });
    expect(screen.getByText('Confirm')).toBeInTheDocument();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    expect(screen.getByText('Cancel switch')).toBeInTheDocument();
    expect(screen.getByText('Continue to switch')).toBeInTheDocument();
  });
});
