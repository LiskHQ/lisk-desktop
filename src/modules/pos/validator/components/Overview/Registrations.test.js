import { renderWithRouterAndQueryClient } from 'src/utils/testHelpers';
import { screen } from '@testing-library/react';
import * as queryHooks from '../../hooks/queries/useRegistrations';
import { useRegistrations } from '../../hooks/queries';
import Registrations from './Registrations';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

jest.spyOn(queryHooks, 'useRegistrations');

describe('Registrations', () => {
  it('should render the empty state', () => {
    useRegistrations.mockReturnValue({
      data: {
        labels: [],
        values: [],
      },
      isLoading: false,
    });
    renderWithRouterAndQueryClient(Registrations, {});
    expect(screen.getAllByText('No validators information')).toBeTruthy();
  });

  it('should render the chart', () => {
    useRegistrations.mockReturnValue({
      data: {
        labels: ['2021-05-01', '2021-05-02', '2021-05-03'],
        values: [1, 2, 3],
      },
      isLoading: false,
    });
    renderWithRouterAndQueryClient(Registrations, {});
    expect(screen.getAllByText('Registered validators')).toBeTruthy();
  });
});
