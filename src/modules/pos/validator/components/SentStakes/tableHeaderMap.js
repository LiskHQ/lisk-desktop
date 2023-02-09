import grid from 'flexboxgrid/dist/flexboxgrid.css';

export default (t) => [
  {
    title: t('Validator'),
    classList: `${grid['col-xs-3']}`,
  },
  {
    title: t('Rank'),
    classList: `${grid['col-xs-1']}`,
  },
  {
    title: t('Validator weight'),
    classList: `${grid['col-xs-2']}`,
  },
  {
    title: t('Commission (%)'),
    classList: `${grid['col-xs-2']}`,
  },
  {
    title: t('Stake amount'),
    classList: `${grid['col-xs-2']}`,
  },
  {
    title: t('Action'),
    classList: `${grid['col-xs-2']}`,
  },
];
