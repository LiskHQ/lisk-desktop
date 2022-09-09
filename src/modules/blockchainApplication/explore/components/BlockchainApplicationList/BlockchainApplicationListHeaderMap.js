import grid from 'flexboxgrid/dist/flexboxgrid.css';

export default (t) => [
  {
    title: t('Name'),
    classList: grid['col-xs-4'],
  },
  {
    title: t('Chain ID'),
    classList: grid['col-xs-3'],
  },
  {
    title: t('Status'),
    classList: grid['col-xs-2'],
  },
  {
    title: t('LSK deposited'),
    classList: grid['col-xs-3'],
  },
];
