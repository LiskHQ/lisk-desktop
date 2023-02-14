import { useMemo } from 'react';
import { useCommandParametersSchemas } from './queries';

export const useCommandSchema = () => {
  const { data, ...rest } = useCommandParametersSchemas();

  const moduleCommandSchemas = useMemo(() => {
    const { commands } = data?.data || {};

    if (!commands) return {};

    return commands.reduce(
      (result, { moduleCommand, schema }) => ({ ...result, [moduleCommand]: schema }),
      {}
    );
  }, [data]);

  return { moduleCommandSchemas, ...rest };
};
