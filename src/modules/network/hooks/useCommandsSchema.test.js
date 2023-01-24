import { renderHook } from '@testing-library/react-hooks';
import { mockCommandParametersSchemas } from 'src/modules/common/__fixtures__';
import { useCommandParametersSchemas } from './queries/useCommandParametersSchemas';
import { useCommandSchema } from './useCommandsSchema';

jest.mock('./queries/useCommandParametersSchemas');

describe('useCommandSchema', () => {
  it('should return command schemas', async () => {
    useCommandParametersSchemas.mockReturnValue({
      data: { data: { commands: mockCommandParametersSchemas.data.commands } },
    });

    const { result } = renderHook(() => useCommandSchema());

    expect(result.current.moduleCommandSchemas).toEqual(
      mockCommandParametersSchemas.data.commands.reduce(
        (schemas, { moduleCommand, schema }) => ({ ...schemas, [moduleCommand]: schema }),
        {}
      )
    );
  });

  it('should return empty object if no command parameters', async () => {
    useCommandParametersSchemas.mockReturnValue({});

    const { result } = renderHook(() => useCommandSchema());
    expect(result.current.moduleCommandSchemas).toEqual({});
  });
});
