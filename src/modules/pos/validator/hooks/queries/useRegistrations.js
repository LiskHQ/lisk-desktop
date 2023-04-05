import { GENERATOR, REGISTRATIONS } from 'src/const/queries';
import { API_VERSION } from 'src/const/config';
import { useCustomQuery } from 'src/modules/common/hooks';

const totalValidatorsConfig = {
  url: `/api/${API_VERSION}/pos/validators`,
  method: 'get',
  event: 'get.validators',
  params: { limit: 1 },
};
const registrationsConfig = {
  url: `/api/${API_VERSION}/transactions`,
  method: 'get',
  event: 'get.transactions',
  params: { limit: 100, moduleCommand: 'pos:registerValidator' },
};
const monthDuration = 2674800;

const getAmountOfValidatorsInTime = (data) => data.map((item) => item[1]);
const getAmountOfValidatorsLabels = (data) => data.map((item) => item[0]);
const getDate = (timestamp) => {
  const d = new Date(timestamp * 1000);
  return `${new Date(d).getFullYear()}-${new Date(d).getMonth() + 1}`;
};
/**
 * Creates a custom hook for validator registrations queries
 *
 * @returns the query object
 */
// eslint-disable-next-line max-statements
export const useRegistrations = () => {
  const {
    data: validators = { meta: { total: 0 } },
    isLoading: isValidatorsLoading,
    isFetched: isValidatorsFetched,
  } = useCustomQuery({
    keys: [GENERATOR],
    config: totalValidatorsConfig,
  });
  const {
    data: registrations = { data: [], meta: { total: 0 } },
    isLoading: isRegistrationsLoading,
    isFetched: isRegistrationsFetched,
  } = useCustomQuery({
    keys: [REGISTRATIONS],
    config: registrationsConfig,
  });

  // create monthly number of registration as a dictionary
  const monthStats = registrations.data
    .map((tx) => tx.block.timestamp)
    .reduce((acc, timestamp) => {
      const date = getDate(timestamp);
      acc[date] = typeof acc[date] === 'number' ? acc[date] + 1 : 1;
      return acc;
    }, {});

  const offset = Math.floor(validators.meta.total - Object.values(monthStats).reduce((acc, val) => acc + val, 0));

  // Create a sorted array of monthly accumulated number of registrations
  const chartData = Object.entries(monthStats)
    .sort(([d1], [d2]) => d1 > d2)
    .reduce((acc, [date, count]) => {
      const last = acc[acc.length - 1];
      acc.push([date, (last[1] + count)]);
      return acc;
    }, [[getDate(registrations.data[0]?.block.timestamp - monthDuration), offset]])
    .filter(([date]) => date !== 'NaN-NaN');

  const labels = getAmountOfValidatorsLabels(chartData);
  const values = getAmountOfValidatorsInTime(chartData);
  const isLoading = isValidatorsLoading || isRegistrationsLoading;
  const isFetched = isValidatorsFetched && isRegistrationsFetched;

  return {
    data: {
      labels,
      values,
    },
    isLoading,
    isFetched,
  };
};
