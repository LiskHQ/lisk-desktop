import grid from 'flexboxgrid/dist/flexboxgrid.css';

export default (t) => [
  {
    title: t('Index'),
    classList: grid['col-xs-4'],
  },
  {
    title: t('Module'),
    classList: grid['col-xs-4'],
  },
  {
    title: t('Type ID'),
    classList: grid['col-xs-3'],
  },
];
