import grid from 'flexboxgrid/dist/flexboxgrid.css';

export default t => ([
  {
    title: t('Rank'),
    classList: grid['col-md-1'],
  },
  {
    title: t('Name'),
    classList: grid['col-md-2'],
  },
]);
