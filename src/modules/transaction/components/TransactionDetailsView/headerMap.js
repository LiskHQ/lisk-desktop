import grid from 'flexboxgrid/dist/flexboxgrid.css';

export default (t) => [
  {
    title: t('label'),
    classList: grid['col-xs-5'],
  },
  {
    title: t('value'),
    classList: grid['col-xs-7'],
  },
];
