import { renderHook } from '@testing-library/react-hooks';
import * as validatorQueries from '@pos/validator/hooks/queries/useValidators';
import { mockValidators } from '@pos/validator/__fixtures__';
import { useValidators } from '@pos/validator/hooks/queries';
import { convertCommissionToPercentage } from '@pos/validator/utils';
import { useCurrentCommissionPercentage } from './useCurrentCommissionPercentage';

jest.spyOn(validatorQueries, 'useValidators');
describe('useCurrentCommissionPercentage', () => {
  it('Initial values must be empty', () => {
    useValidators.mockReturnValue({ data: mockValidators });
    const { result } = renderHook(() => useCurrentCommissionPercentage('someAddress'));
    const expectedCommission = convertCommissionToPercentage(mockValidators.data[0].commission);
    const { currentCommission } = result.current;
    expect(currentCommission).toBe(expectedCommission);
  });
});
