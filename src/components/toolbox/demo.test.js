import { mountWithRouter } from '../../utils/testHelpers';
import ToolboxDemo from './demo';

describe('ToolboxDemo', () => {
  it('should render', () => {
    const wrapper = mountWithRouter(ToolboxDemo);
    expect(wrapper).toHaveLength(1);
  });
});
