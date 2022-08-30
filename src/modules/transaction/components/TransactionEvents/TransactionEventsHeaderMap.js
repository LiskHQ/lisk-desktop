import grid from 'flexboxgrid/dist/flexboxgrid.css';

export default (t) => ([
  {
    title: t('ID'),
    classList: grid['col-xs-2'],
  },
  {
    title: t('Hash'),
    classList: grid['col-xs-6'],
  },
  {
    title: t('Action'),
    classList: grid['col-xs-3'],
  },
  {
    title: '',
    classList: `${grid['col-xs-1']} ${grid['col-md-1']}`,
  },
]);
