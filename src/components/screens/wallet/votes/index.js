// istanbul ignore file
import { withTranslation } from 'react-i18next';
import { getVotes } from '../../../../utils/api/delegates';
import liskService from '../../../../utils/api/lsk/liskService';
import withData from '../../../../utils/withData';
import Votes from './votes';

const apis = {
  votes: {
    apiUtil: getVotes,
    defaultData: [],
    autoload: false,
    transformResponse: response => response.data.votes,
  },
  accounts: {
    apiUtil: liskService.getAccounts,
    autoload: false,
    defaultData: {},
    transformResponse: response =>
      response.data.reduce((dict, account) => {
        dict[account.address] = account;
        return dict;
      }, {}),
  },
};

export default withData(apis)(withTranslation()(Votes));
