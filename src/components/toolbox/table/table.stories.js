import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import StoryWrapper from '../../../../.storybook/components/StoryWrapper/StoryWrapper';
import Table from './index';
import CheckBox from '../checkBox';

storiesOf('Toolbox', module)
  .add('Table', () => (
    <StoryWrapper>
      <h3>Table</h3>
      <Table
        sort="id:asc"
        onSortChange={action('clicked')}
        data={[
          { id: 1, name: 'Row 1' },
          { id: 2, name: 'Row 2' },
          { id: 3, name: 'Row 3' },
        ]}
        columns={[{
          /* eslint-disable react/display-name */
          className: grid['col-xs-1'], header: '', id: 'checkbox', getValue: () => <CheckBox />,
        }, {
          className: grid['col-xs-2'], header: 'ID', id: 'id', isSortable: true,
        }, {
          className: grid['col-xs-6'], header: 'Name', id: 'name', getValue: row => <i>{row.name}</i>, isSortable: true,
        }, {
          className: grid['col-xs-3'], header: 'Other', id: 'other', getValue: () => 'Something static',
          /* eslint-enable react/display-name */
        }]}
      />
    </StoryWrapper>
  ));
