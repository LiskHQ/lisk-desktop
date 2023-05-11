import { screen } from '@testing-library/react';
import { renderWithRouterAndQueryClient } from 'src/utils/testHelpers';
import validators from '@tests/constants/validators';
import { useValidators } from '../../hooks/queries';
import ValidatorPerformance from './ValidatorPerformance';

jest.mock('../../hooks/queries');

const updatedValidatorData = { ...validators[0], status: 'punished' };

useValidators.mockReturnValue({
  data: { data: [updatedValidatorData], meta: {} },
  isLoading: false,
  error: false,
});

describe('ValidatorPerformance', () => {
  const props = {
    history: {
      location: {
        search: `?address=${validators[0].address}`,
      },
    },
  };

  afterEach(() => {
    useValidators.mockReset();
  });

  it('renders properly', () => {
    renderWithRouterAndQueryClient(ValidatorPerformance, props);
    expect(screen.getByText('Punishment details')).toBeInTheDocument();
    expect(
      screen.getByText(
        'The validator was punished 1 time. Four more punishments will cause the permanent ban of the validator.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
  });

  it('displays an empty div if data is empty and there are no errors', () => {
    useValidators.mockReturnValue({
      data: {},
      isLoading: false,
      error: false,
    });
    renderWithRouterAndQueryClient(ValidatorPerformance, props);
    expect(screen.queryByText('Whoops, that page is gone.')).not.toBeInTheDocument();
  });

  it('displays the error screen if there are errors', () => {
    useValidators.mockReturnValue({
      data: {},
      isLoading: false,
      error: true,
    });
    renderWithRouterAndQueryClient(ValidatorPerformance, props);
    expect(screen.getByText('Whoops, that page is gone.')).toBeInTheDocument();
  });
});
