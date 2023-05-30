import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ConfirmPassphrase from './confirmPassphrase';

describe('Register Process - Confirm Passphrase', () => {
  const props = {
    passphrase: 'barely feature filter inmate exotic sister dog boil crush build canvas latin',
    nextStep: jest.fn(),
  };

  const selectWrongWords = () => {
    screen
      .getAllByTestId('option')
      .forEach(
        (element) => !props.passphrase.includes(element.innerText) && fireEvent.click(element)
      );
  };

  const selectRightWords = () => {
    screen
      .getAllByTestId('option')
      .forEach(
        (element) => props.passphrase.includes(element.innerHTML) && fireEvent.click(element)
      );
  };

  beforeEach(() => {
    render(<ConfirmPassphrase {...props} />);
  });

  it('Should handle selection', async () => {
    selectRightWords();
    selectRightWords();
    fireEvent.click(screen.getByTestId('confirm-button'));

    await waitFor(() => {
      expect(props.nextStep).toHaveBeenCalled();
    }, 5000);
  });

  it('Should update empty values after wrong selection', async () => {
    selectWrongWords();
    fireEvent.click(screen.getByTestId('confirm-button'));

    await waitFor(() => {
      const inputFields = screen.getAllByTestId('word');
      const [missingWord1, missingWord2] = inputFields.reduce((result, { innerHTML }, index) => {
        if (innerHTML === '_______') return [...result, index];
        return result;
      }, []);

      expect(missingWord1 + 1).toBeTruthy();
      expect(missingWord2 + 1).toBeTruthy();
    }, 5000);
  });
});
