/* istanbul ignore file */
import { transformStringDateToUnixTimestamp } from 'src/utils/dateTime';

const transformParams = (params) =>
  Object.keys(params)
    .filter((param) => params[param] !== '')
    .reduce((acc, item) => {
      switch (item) {
        case 'dateFrom':
          if (params[item]) {
            if (!acc.timestamp) acc.timestamp = ':';
            acc.timestamp = acc.timestamp.replace(
              /(\d+)?:/,
              `${transformStringDateToUnixTimestamp(params[item])}:`
            );
          }
          break;
        case 'dateTo':
          if (params[item]) {
            if (!acc.timestamp) acc.timestamp = ':';
            // We add 86400 so the range is inclusive
            acc.timestamp = acc.timestamp.replace(
              /:(\d+)?/,
              `:${transformStringDateToUnixTimestamp(params[item]) + 86400}`
            );
          }
          break;
        default:
          acc[item] = params[item];
      }

      return acc;
    }, {});

export default transformParams;
