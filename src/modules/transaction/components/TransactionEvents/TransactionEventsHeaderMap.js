import grid from 'flexboxgrid/dist/flexboxgrid.css';

export default (t) => ([
  {
    title: t('Index'),
    classList: grid['col-xs-1'],
  },
  {
    title: t('ID'),
    classList: grid['col-xs-6'],
  },
  {
    title: t('Module'),
    classList: grid['col-xs-3'],
  },
  {
    title: t('Type ID'),
    classList: grid['col-xs-2'],
  },
]);
