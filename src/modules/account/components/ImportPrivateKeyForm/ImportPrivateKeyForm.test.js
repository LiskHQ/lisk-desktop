import { fireEvent, screen } from '@testing-library/react';
import { renderWithCustomRouter } from 'src/utils/testHelpers';
import ImportPrivateKeyForm from './ImportPrivateKeyForm';

jest.mock('react-i18next');

const props = {
  settings: {},
  onAddAccount: jest.fn(),
};

beforeEach(() => {
  renderWithCustomRouter(ImportPrivateKeyForm, props);
});

describe('ImportPrivateKeyForm', () => {
  it('should render successfully', () => {
    expect(screen.getByText('Add your account')).toBeTruthy();
    expect(screen.getByText('Enter your private key to manage your account.')).toBeTruthy();
    expect(screen.getByText('Continue to set password')).toBeTruthy();
    expect(screen.getByText('Go back')).toBeTruthy();

    fireEvent.click(screen.getByText('Continue to set password'));
    expect(props.onAddAccount).not.toBeCalled();
  });

  it('should trigger add account', () => {
    const inputField = screen.getByPlaceholderText('Enter private key');

    fireEvent.change(inputField, {
      target: {
        value:
          'e005805e731d324ec6f083f7ec31967e60cda674cd09f51c323fce63a933e0dadd2df9b2b007bd8a2387f4e652517d6e094cdb54edf0c67b06d4786f5ecf964d',
      },
    });

    fireEvent.click(screen.getByText('Continue to set password'));
    expect(props.onAddAccount).toBeCalled();
  });

  it('should trigger add account on enter key been pressed', () => {
    const inputField = screen.getByPlaceholderText('Enter private key');

    fireEvent.change(inputField, {
      target: {
        value:
          'e005805e731d324ec6f083f7ec31967e60cda674cd09f51c323fce63a933e0dadd2df9b2b007bd8a2387f4e652517d6e094cdb54edf0c67b06d4786f5ecf964d',
      },
    });

    fireEvent.keyPress(inputField, { key: 'Enter', code: 13, charCode: 13 });
    expect(props.onAddAccount).toBeCalled();
  });
});
