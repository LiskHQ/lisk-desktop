// istanbul ignore file
import withFilters from 'src/utils/withFilters';
import Blocks, { defaultFilters } from './blocks';

export default withFilters('blocks', defaultFilters, 'height:desc')(Blocks);
