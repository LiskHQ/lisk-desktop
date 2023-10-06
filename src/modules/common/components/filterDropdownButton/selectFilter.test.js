import React from 'react';
import { mount } from 'enzyme';
import { useCommandSchema } from '@network/hooks';
import SelectFilter from './selectFilter';
import { mockCommandParametersSchemas } from '../../__fixtures__';

jest.mock('@network/hooks/useCommandsSchema');

describe('SelectFilter', () => {
  const props = {
    t: (v) => v,
    filters: {
      moduleCommand: '',
    },
    placeholder: 'Sample title',
    name: 'type',
    updateCustomFilters: jest.fn(),
    label: 'Type',
  };

  useCommandSchema.mockReturnValue({
    moduleCommandSchemas: mockCommandParametersSchemas.data.commands.reduce(
      (result, { moduleCommand, schema }) => ({ ...result, [moduleCommand]: schema }),
      {}
    ),
  });

  it('should handle input selection', () => {
    const wrapper = mount(<SelectFilter {...props} />);
    wrapper.find('Select.input').simulate('click');
    wrapper.find('span.option').at(0).simulate('click');
    expect(props.updateCustomFilters).toBeCalled();
  });

  it('should not render the component while loading', () => {
    useCommandSchema.mockReturnValue({
      isLoading: true,
      moduleCommandSchemas: mockCommandParametersSchemas.data.commands.reduce(
        (result, { moduleCommand, schema }) => ({ ...result, [moduleCommand]: schema }),
        {}
      ),
    });

    const wrapper = mount(<SelectFilter {...props} />);
    expect(wrapper.find('.fieldGroup').exists()).toBeFalsy();
  });
});
