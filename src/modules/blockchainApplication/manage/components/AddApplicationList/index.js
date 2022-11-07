/* istanbul ignore file */
import { compose } from 'redux';
import withFilters from 'src/utils/withFilters';
import AddApplicationList from './AddApplicationList';

const defaultUrlSearchParams = { isDefault: false, search: '' };

export default compose(
  withFilters('liskApplications', defaultUrlSearchParams),
)(AddApplicationList);
