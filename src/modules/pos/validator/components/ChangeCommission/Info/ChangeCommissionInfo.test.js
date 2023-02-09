import { renderWithRouterAndQueryClient } from 'src/utils/testHelpers';
import { screen } from '@testing-library/react';

import * as commissionHook from '@pos/validator/hooks/useCurrentCommissionPercentage';
import { convertCommissionToPercentage } from '@pos/validator/utils';
import {
  useCurrentCommissionPercentage
} from '@pos/validator/hooks/useCurrentCommissionPercentage';
import {
  ChangeCommissionInfo
} from './ChangeCommissionInfo';

jest.useRealTimers()
jest.spyOn(commissionHook, 'useCurrentCommissionPercentage')


describe('ChangeCommissionDialog', () => {
  it('should render properly', () => {
    const currentCommission = 4000
    const newCommission = 5000
    useCurrentCommissionPercentage.mockReturnValue({currentCommission})
    const transactionJSON = {
      params: {
        newCommission
      }
    }

    const currentCommissionPercentage = convertCommissionToPercentage(currentCommission)
    const newCommissionPercentage = convertCommissionToPercentage(newCommission)
    renderWithRouterAndQueryClient(ChangeCommissionInfo, {transactionJSON});

    expect(screen.getByTestId('current-commission')).toHaveTextContent(currentCommissionPercentage)
    expect(screen.getByTestId('new-commission')).toHaveTextContent(newCommissionPercentage)
  });
});
