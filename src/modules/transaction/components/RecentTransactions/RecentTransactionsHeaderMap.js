import grid from 'flexboxgrid/dist/flexboxgrid.css';

export default (t) => [
  {
    title: t('Transaction'),
    classList: grid['col-xs-8'],
  },
  {
    title: t('Amount'),
    classList: grid['col-xs-4'],
  },
];
