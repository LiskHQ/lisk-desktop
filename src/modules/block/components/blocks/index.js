import withFilters from 'src/utils/withFilters';
import Blocks, { defaultFilters } from './blocks';

const defaultSort = 'height:desc';
export default withFilters('blocks', defaultFilters, defaultSort)(Blocks);
