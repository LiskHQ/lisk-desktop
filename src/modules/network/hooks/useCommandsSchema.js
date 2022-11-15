const { useMemo } = require('react');
const { useCommandParametersSchemas } = require('./queries');

export const useCommandSchema = () => {
  const { data, isLoading } = useCommandParametersSchemas();

  const moduleCommandSchemas = useMemo(() => {
    const { commands } = data?.data || {};

    if (!commands) return {};

    return commands.reduce(
      (result, { moduleCommand, schema }) => ({ ...result, [moduleCommand]: schema }),
      {}
    );
  }, [isLoading]);

  return { isLoading, moduleCommandSchemas };
};
