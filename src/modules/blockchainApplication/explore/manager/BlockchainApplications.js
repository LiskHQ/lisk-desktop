/* istanbul ignore file */
import { compose } from 'redux';
import withFilters from 'src/utils/withFilters';
import ManageBlockchainApplicationsView from '../components/BlockchainApplications';

const defaultUrlSearchParams = { search: '' };

export default compose(
  withFilters('applications', defaultUrlSearchParams),
)(ManageBlockchainApplicationsView);
