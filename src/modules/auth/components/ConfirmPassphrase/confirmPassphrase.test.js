import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ConfirmPassphrase from './confirmPassphrase';

describe('Register Process - Confirm Passphrase', () => {
  const props = {
    passphrase: 'barely feature filter inmate exotic sister dog boil crush build canvas latin',
    nextStep: jest.fn(),
  };

  const selectWrongWords = async () => {
    const [wrong1, wrong2] = screen
      .getAllByTestId('option')
      .reduce(
        (result, element) =>
          !props.passphrase.includes(element.innerHTML) ? [...result, element] : result,
        []
      );

    fireEvent.click(wrong1);
    fireEvent.click(wrong2);
  };

  const selectRightWords = () => {
    screen
      .getAllByTestId('option')
      .forEach(
        (element) => props.passphrase.includes(element.innerHTML) && fireEvent.click(element)
      );
  };

  it('Should handle selection', async () => {
    render(<ConfirmPassphrase {...props} />);
    await waitFor(selectRightWords);
    selectRightWords();
    fireEvent.click(screen.getByTestId('confirm-button'));

    await waitFor(() => {
      expect(props.nextStep).toHaveBeenCalled();
    }, 5000);
  });

  it('Should update empty values after wrong selection', async () => {
    render(<ConfirmPassphrase {...props} />);
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
