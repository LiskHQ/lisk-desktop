// istanbul ignore file
import { withTranslation } from 'react-i18next';
import { getVotes, getDelegates } from '../../../utils/api/delegates';
import withData from '../../../utils/withData';
import Delegates from './delegates';

const apis = {
  votes: {
    apiUtil: getVotes,
    defaultData: [],
    transformResponse: response => response.data.votes,
  },
  delegates: {
    apiUtil: getDelegates,
    defaultData: {},
    transformResponse: (response, oldData) => ({
      ...oldData,
      ...response.data.reduce((acc, item) => ({ ...acc, [item.username]: item }), {}),
    }),
  },
};

export default withData(apis)(withTranslation()(Delegates));
