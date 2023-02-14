import { mockSentStakes } from '@pos/validator/__fixtures__';
import { renderWithRouter } from 'src/utils/testHelpers';
import { usePosConstants, useSentStakes } from '@pos/validator/hooks/queries';
import { mockPosConstants } from '@pos/validator/__fixtures__/mockPosConstants';
import StakesCount from '@pos/validator/components/StakesCount/index';
import { screen } from '@testing-library/react';

jest.mock('@pos/validator/hooks/queries');

describe('StakeCount', () => {
  const props = {
    address: 'lskdxc4ta5j43jp9ro3f8zqbxta9fn6jwzjucw7yt',
    hideIcon: false,
  };

  useSentStakes.mockReturnValue({ data: mockSentStakes });
  usePosConstants.mockReturnValue({ data: mockPosConstants });

  it('should display properly', async () => {
    const { container } = renderWithRouter(StakesCount, props);
    expect(screen.getByText(10 - mockSentStakes.meta.count)).toBeTruthy();
    const availableSlots = 10 - mockSentStakes.meta.count;
    expect(container).toHaveTextContent(
      `${availableSlots}/10 {{stake}} still available in your account`
    );
  });

  it('should display properly', async () => {
    useSentStakes.mockReturnValue({ data: {} });
    const { container } = renderWithRouter(StakesCount, props);
    expect(container).toHaveTextContent(`0/10 {{stake}} still available in your account`);
  });
});
